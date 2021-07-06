/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePolicyGroup } from "hooks/usePolicyGroup";
import Loading from "components/Loading";
import Link from "next/link";
import styles from "styles/modules/PolicyGroupAssignments.module.scss";
import Button from "components/Button";
import PolicySearchAndResults from "components/policy-groups/PolicySearchAndResults";
import { useTheme } from "providers/theme";
import PageHeader from "components/layout/PageHeader";
import { showError, showSuccess } from "utils/toast-utils";
import PolicyAssignmentCard from "components/policy-groups/PolicyAssignmentCard";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import PolicyVersionDrawer from "components/policy-groups/PolicyVersionDrawer";
import { usePolicyGroupAssignments } from "hooks/usePolicyGroupAssignments";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import { StatusCodes } from "http-status-codes";
import Text from "components/Text";

const ADD = "ADD";
const REMOVE = "REMOVE";
const UPDATE = "UPDATE";

const EditPolicyGroupAssignments = () => {
  const router = useRouter();

  const { name } = router.query;
  const { theme } = useTheme();

  const { dispatch } = useAppState();

  const [showPolicyVersionDrawer, setShowPolicyVersionDrawer] = useState(false);
  const [drawerPolicy, setDrawerPolicy] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const { policyGroup, loading: loadingPolicyGroup } = usePolicyGroup(name);

  const {
    assignments: data,
    loading: loadingAssignments,
  } = usePolicyGroupAssignments(policyGroup?.name);

  const [assignments, setAssignments] = useState({});
  const [assignedToGroup, setAssignedToGroup] = useState([]);

  useEffect(() => {
    if (data?.length && !Object.keys(assignments).length) {
      const assignmentData = {};
      data.forEach((assignment) => {
        assignmentData[assignment.policyId] = assignment;
      });
      setAssignments(assignmentData);
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(assignments).length > 0) {
      const assignedToPolicyGroup = Object.keys(assignments)
        .map((policyId) => {
          const assignment = assignments[policyId];
          if (assignment.action === REMOVE) {
            return null;
          } else return assignment;
        })
        .filter((val) => val);
      setAssignedToGroup(assignedToPolicyGroup);
    }
  }, [assignments]);

  const updateAssignments = (assignment, action) => {
    const updatedAssignments = { ...assignments };
    updatedAssignments[assignment.policyId] = {
      ...assignment,
      action,
    };

    setAssignments(updatedAssignments);
  };

  const onAssign = (assignment) => updateAssignments(assignment, ADD);

  const onRemove = (assignment) => updateAssignments(assignment, REMOVE);

  const onVersionSelect = (version, currentAssignment) => {
    const updatedAssignment = {
      ...currentAssignment,
      policyVersion: version.version,
      policyVersionId: version.id,
    };
    const action = currentAssignment.action === ADD ? ADD : UPDATE;

    updateAssignments(updatedAssignment, action);
    setShowPolicyVersionDrawer(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const originalAssignmentPolicyIds = data.map(({ policyId }) => policyId);

    const assignmentsToCreate = Object.values(assignments).filter(
      ({ action, policyId }) =>
        action === ADD && !originalAssignmentPolicyIds.includes(policyId)
    );
    const assignmentsToRemove = Object.values(assignments).filter(
      ({ action, policyId }) =>
        action === REMOVE && originalAssignmentPolicyIds.includes(policyId)
    );
    const assignmentsToUpdate = Object.values(assignments).filter(
      ({ action, policyId }) =>
        action === UPDATE && originalAssignmentPolicyIds.includes(policyId)
    );

    const createPromises = assignmentsToCreate.map(async (assignment) =>
      fetch(`/api/policy-groups/${name}/assignments`, {
        method: "POST",
        body: JSON.stringify(assignment),
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const deletePromises = assignmentsToRemove.map(async (assignment) =>
      fetch(
        `/api/policy-groups/${name}/assignments/${encodeURIComponent(
          assignment.id
        )}`,
        {
          method: "DELETE",
        }
      )
    );

    const updatePromises = assignmentsToUpdate.map(async (assignment) =>
      fetch(
        `/api/policy-groups/${name}/assignments/${encodeURIComponent(
          assignment.id
        )}`,
        {
          method: "PATCH",
          body: JSON.stringify(assignment),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    setLoadingForm(true);
    const responses = await Promise.all([
      ...createPromises,
      ...deletePromises,
      ...updatePromises,
    ]);
    setLoadingForm(false);

    if (responses.some(({ ok }) => !ok)) {
      showError("Failed to save policy group assignments.");
      return;
    }

    const parsingPromises = responses
      .map((response) => {
        if (response.status === StatusCodes.NO_CONTENT) {
          return null;
        }
        return response.json();
      })
      .filter((v) => v);

    const parsedResponses = await Promise.all(parsingPromises);

    const mutatedAssignments = assignedToGroup.map((assignment) => {
      if (assignment.action === ADD) {
        const createdAssignment = parsedResponses.find((response) => {
          return response.data.policyVersionId === assignment.policyVersionId;
        });
        return {
          ...assignment,
          id: createdAssignment.data.id,
          action: null,
        };
      }

      return {
        ...assignment,
        action: null,
      };
    });

    dispatch({
      type: stateActions.SET_CURRENT_POLICY_GROUP_ASSIGNMENTS,
      data: mutatedAssignments,
    });

    showSuccess("Saved!");
    router.push(`/policy-groups/${policyGroup.name}`);
  };

  return (
    <>
      <PageHeader>
        <Text.Heading1>Edit Policy Group Assignments</Text.Heading1>
      </PageHeader>
      <PolicyVersionDrawer
        onClose={() => {
          setShowPolicyVersionDrawer(false);
          setDrawerPolicy(null);
        }}
        isOpen={showPolicyVersionDrawer}
        assignedPolicy={drawerPolicy}
        onVersionSelect={onVersionSelect}
      />
      <div className={`${styles[theme]} ${styles.pageContainer}`}>
        <Loading loading={loadingPolicyGroup}>
          {policyGroup ? (
            <>
              <div className={styles.contentContainer}>
                <div className={styles.assignmentsContainer}>
                  <Text.Heading1 className={styles.assignmentsHeader}>
                    {policyGroup.name}
                  </Text.Heading1>
                  <Text.Heading2 className={styles.assignmentsHeader}>
                    Assigned Policies
                  </Text.Heading2>
                  <Loading loading={loadingAssignments}>
                    {assignedToGroup.length > 0 ? (
                      <>
                        {assignedToGroup.map((assignment) => {
                          const hasMultipleVersions =
                            assignment.policyVersionCount > 1;
                          return (
                            <PolicyAssignmentCard
                              key={assignment.id}
                              policy={assignment}
                              actions={
                                <div className={styles.assignmentActions}>
                                  {hasMultipleVersions && (
                                    <Button
                                      label={"Change Policy Version"}
                                      buttonType={"icon"}
                                      onClick={() => {
                                        setDrawerPolicy(assignment);
                                        setShowPolicyVersionDrawer(true);
                                      }}
                                      showTooltip
                                    >
                                      <Icon
                                        name={ICON_NAMES.PENCIL}
                                        size={"large"}
                                      />
                                    </Button>
                                  )}
                                  <Button
                                    label={"Remove Policy Assignment"}
                                    buttonType={"icon"}
                                    onClick={() => onRemove(assignment)}
                                    showTooltip
                                  >
                                    <Icon
                                      name={ICON_NAMES.X_CIRCLE}
                                      size={"large"}
                                    />
                                  </Button>
                                </div>
                              }
                            />
                          );
                        })}
                      </>
                    ) : (
                      <Text.Body1>
                        No policies are assigned to this policy group.
                      </Text.Body1>
                    )}
                  </Loading>
                </div>
                <PolicySearchAndResults
                  onAssign={onAssign}
                  assignedToGroup={assignedToGroup}
                />
              </div>
              <div className={styles.actionButtonsContainer}>
                <Button
                  label={"Save Assignments"}
                  type={"button"}
                  onClick={onSubmit}
                  loading={loadingForm}
                />
                <Button
                  label={"Cancel"}
                  buttonType={"text"}
                  type={"button"}
                  onClick={router.back}
                  disabled={loadingForm}
                />
              </div>
            </>
          ) : (
            <div className={styles.notFoundContainer}>
              <Text.Heading1>
                No policy group found under {`"${name}"`}
              </Text.Heading1>
              <Text.Body1>
                Go to the <Link href={"/policy-groups"}>dashboard</Link> to view
                all policy groups
              </Text.Body1>
            </div>
          )}
        </Loading>
      </div>
    </>
  );
};

export default EditPolicyGroupAssignments;
