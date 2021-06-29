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
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import PolicySearchAndResults from "components/policy-groups/PolicySearchAndResults";
import { useTheme } from "providers/theme";
import PageHeader from "components/layout/PageHeader";
import { showError, showSuccess } from "utils/toast-utils";
import { mutate } from "swr";
import PolicyAssignmentCard from "components/policy-groups/PolicyAssignmentCard";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import PolicyVersionDrawer from "components/policy-groups/PolicyVersionDrawer";

// TODO: hide the version button when no other versions exist
const ADD = "ADD";
const REMOVE = "REMOVE";
const UPDATE = "UPDATE";

const EditPolicyGroupAssignments = () => {
  const router = useRouter();

  const { name } = router.query;
  const { theme } = useTheme();

  const [showPolicyVersionDrawer, setShowPolicyVersionDrawer] = useState(false);
  const [drawerPolicy, setDrawerPolicy] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const { policyGroup, loading: loadingPolicyGroup } = usePolicyGroup(name);

  const [assignments, setAssignments] = useState({});
  const [assignedToGroup, setAssignedToGroup] = useState([]);

  const { data, loading: loadingAssignments } = usePaginatedFetch(
    policyGroup ? `/api/policy-groups/${policyGroup.name}/assignments` : null,
    {},
    50
  );

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
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    const originalAssignmentPolicyIds = data.map(
      ({ policyId }) => policyId
    );

    const assignmentsToCreate = Object.values(assignments).filter(
      ({ action, policyId }) =>
        action === ADD &&
        !originalAssignmentPolicyIds.includes(policyId)
    );
    const assignmentsToRemove = Object.values(assignments).filter(
      ({ action, policyId }) =>
        action === REMOVE &&
        originalAssignmentPolicyIds.includes(policyId)
    );
    const assignmentsToUpdate = Object.values(assignments).filter(
      ({ action, policyId }) =>
        action === UPDATE &&
        originalAssignmentPolicyIds.includes(policyId)
    );

    console.log('assignmentsToCreate', assignmentsToCreate);
    console.log('assignmentsToRemove', assignmentsToRemove);
    console.log('assignmentsToUpdate', assignmentsToUpdate);

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
        `/api/policy-groups/${name}/assignments?assignmentId=${encodeURIComponent(
          assignment.id
        )}`,
        {
          method: "DELETE",
        }
      )
    );

    const updatePromises = assignmentsToUpdate.map(async (assignment) =>
      fetch(`/api/policy-groups/${name}/assignments?assignmentId=${encodeURIComponent(
        assignment.id
      )}`, {
        method: "PATCH",
        body: JSON.stringify(assignment),
        headers: {
          "Content-Type": "application/json",
        },
      })
    )

    setLoadingForm(true);
    const responses = await Promise.all([...createPromises, ...deletePromises, ...updatePromises]);
    setLoadingForm(false);

    if (responses.some(({ ok }) => !ok)) {
      showError("Failed to save policy group assignments.");
      return;
    }

    await mutate(`/api/policy-groups/${policyGroup.name}/assignments`);

    showSuccess("Saved!");
    router.push(`/policy-groups/${policyGroup.name}`);
  };

  return (
    <>
      <PageHeader>
        <h1>Edit Policy Group Assignments</h1>
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
            <div className={styles.contentContainer}>
              <div className={styles.assignmentsContainer}>
                <p className={styles.assignmentsHeader}>{policyGroup.name}</p>
                <p>Assigned Policies</p>
                <Loading loading={loadingAssignments}>
                  {assignedToGroup.length > 0 ? (
                    <>
                      {assignedToGroup.map((assignment) => {
                        return (
                          <PolicyAssignmentCard
                            key={assignment.id}
                            policy={assignment}
                            actions={
                              <div className={styles.assignmentActions}>
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
                    <p>No policies are assigned to this policy group.</p>
                  )}
                </Loading>
              </div>
              <PolicySearchAndResults
                onAssign={onAssign}
                assignedToGroup={assignedToGroup}
              />
            </div>
          ) : (
            <div className={styles.notFoundContainer}>
              <h1>No policy group found under {`"${name}"`}</h1>
              <p>
                Go to the <Link href={"/policy-groups"}>dashboard</Link> to view
                all policy groups
              </p>
            </div>
          )}
        </Loading>

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
      </div>
    </>
  );
};

export default EditPolicyGroupAssignments;
