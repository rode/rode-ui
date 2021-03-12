export const mockResource = {
  "resources": [
    {
      "name": "",
      "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
      "contentHash": null
    }
  ],
  "nextPageToken": ""
}

export const mockResourceOccurrences = {
  "occurrences": [
    {
      "name": "projects/rode/occurrences/05f0f2a8-93fd-470d-8202-ec3fd542e8a9",
      "resource": {
        "name": "some name",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/provider_example/notes/exampleDeploymentNote",
      "kind": "DEPLOYMENT",
      "remediation": "",
      "createTime": "2021-03-11T23:14:41.598324500Z",
      "updateTime": null,
      "deployment": {
        "deployment": {
          "userEmail": "user_email",
          "deployTime": "2000-01-23T04:56:07Z",
          "undeployTime": "2000-01-23T04:56:07Z",
          "config": "config",
          "address": "address",
          "resourceUri": [
            "resource_uri",
            "resource_uri"
          ],
          "platform": "CUSTOM"
        }
      }
    },
    {
      "name": "projects/rode/occurrences/999f4e01-fb04-4d1a-9ee5-df1ac7cf19b2",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/exampleBuildNote",
      "kind": "BUILD",
      "remediation": "",
      "createTime": "2021-03-11T23:14:41.597994600Z",
      "updateTime": null,
      "build": {
        "provenance": {
          "id": "build identifier",
          "projectId": "some project identifier",
          "commands": [],
          "builtArtifacts": [
            {
              "checksum": "123",
              "id": "some identifier for the artifact",
              "names": [
                "name of related artifact"
              ]
            }
          ],
          "createTime": "2020-03-12T14:01:39.728983Z",
          "startTime": "2020-03-12T14:02:39.728983Z",
          "endTime": "2020-03-12T14:03:39.728983Z",
          "creator": "user initiating the build",
          "logsUri": "location of build logs",
          "sourceProvenance": {
            "artifactStorageSourceUri": "input binary artifacts from this build",
            "fileHashes": {},
            "context": {
              "git": {
                "url": "the git repo url",
                "revisionId": "git commit hash"
              },
              "labels": {}
            },
            "additionalContexts": []
          },
          "triggerId": "triggered by code commit 123",
          "buildOptions": {},
          "builderVersion": "some version of the builder"
        },
        "provenanceBytes": "Z3JhZmVhcw=="
      }
    },
    {
      "name": "projects/rode/occurrences/8865bc74-7ac0-4c2f-bcb2-d4ed1382ca5c",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/exampleBuildNote",
      "kind": "BUILD",
      "remediation": "",
      "createTime": "2021-03-11T23:14:41.593773200Z",
      "updateTime": null,
      "build": {
        "provenance": {
          "id": "build identifier1",
          "projectId": "some project identifier1",
          "commands": [],
          "builtArtifacts": [
            {
              "checksum": "1234",
              "id": "some identifier for the artifact1",
              "names": [
                "name of related artifact",
                "another name"
              ]
            }
          ],
          "createTime": "2020-03-14T12:07:39.728983Z",
          "startTime": "2020-03-14T12:08:39.728983Z",
          "endTime": "2020-03-14T12:09:39.728983Z",
          "creator": "user initiating the build",
          "logsUri": "location of build logs",
          "sourceProvenance": {
            "artifactStorageSourceUri": "input binary artifacts from this build",
            "fileHashes": {},
            "context": {
              "git": {
                "url": "the git repo url",
                "revisionId": "git commit hash"
              },
              "labels": {}
            },
            "additionalContexts": []
          },
          "triggerId": "triggered by code commit 123",
          "buildOptions": {},
          "builderVersion": "some version of the builder"
        },
        "provenanceBytes": "Z3JhZmVhcw=="
      }
    },
    {
      "name": "projects/rode/occurrences/e233fa36-7a68-4822-b1b3-eb56358eb2e9",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "DISCOVERY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "discovered": {
        "discovered": {
          "continuousAnalysis": "CONTINUOUS_ANALYSIS_UNSPECIFIED",
          "lastAnalysisTime": null,
          "analysisStatus": "FINISHED_SUCCESS",
          "analysisStatusError": null
        }
      }
    },
    {
      "name": "projects/rode/occurrences/82804d42-9e51-48c1-b4e8-da2249cf3d90",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "VULNERABILITY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "vulnerability": {
        "type": "docker",
        "severity": "SEVERITY_UNSPECIFIED",
        "cvssScore": 0,
        "packageIssue": [
          {
            "affectedLocation": {
              "cpeUri": "https://nvd.nist.gov/vuln/detail/CVE-2011-3374",
              "package": "apt",
              "version": {
                "epoch": 0,
                "name": "apt",
                "revision": "",
                "kind": "NORMAL"
              }
            },
            "fixedLocation": null,
            "severityName": ""
          }
        ],
        "shortDescription": "It was found that apt-key in apt, all versions, do not correctly validate gpg keys with the master keyring, leading to a potential man-in-the-middle attack.",
        "longDescription": "",
        "relatedUrls": [
          {
            "url": "https://access.redhat.com/security/cve/cve-2011-3374",
            "label": ""
          },
          {
            "url": "https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=642480",
            "label": ""
          },
          {
            "url": "https://people.canonical.com/~ubuntu-security/cve/2011/CVE-2011-3374.html",
            "label": ""
          },
          {
            "url": "https://seclists.org/fulldisclosure/2011/Sep/221",
            "label": ""
          },
          {
            "url": "https://security-tracker.debian.org/tracker/CVE-2011-3374",
            "label": ""
          },
          {
            "url": "https://snyk.io/vuln/SNYK-LINUX-APT-116518",
            "label": ""
          },
          {
            "url": "https://ubuntu.com/security/CVE-2011-3374",
            "label": ""
          }
        ],
        "effectiveSeverity": "LOW"
      }
    },
    {
      "name": "projects/rode/occurrences/cd2ba444-9761-4213-9e83-72eedfb35513",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "VULNERABILITY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "vulnerability": {
        "type": "docker",
        "severity": "SEVERITY_UNSPECIFIED",
        "cvssScore": 0,
        "packageIssue": [
          {
            "affectedLocation": {
              "cpeUri": "https://nvd.nist.gov/vuln/detail/CVE-2019-18276",
              "package": "bash",
              "version": {
                "epoch": 0,
                "name": "bash",
                "revision": "",
                "kind": "NORMAL"
              }
            },
            "fixedLocation": null,
            "severityName": ""
          }
        ],
        "shortDescription": "An issue was discovered in disable_priv_mode in shell.c in GNU Bash through 5.0 patch 11. By default, if Bash is run with its effective UID not equal to its real UID, it will drop privileges by setting its effective UID to its real UID. However, it does so incorrectly. On Linux and other systems that support \"saved UID\" functionality, the saved UID is not dropped. An attacker with command execution in the shell can use \"enable -f\" for runtime loading of a new builtin, which can be a shared object that calls setuid() and therefore regains privileges. However, binaries running with an effective UID of 0 are unaffected.",
        "longDescription": "",
        "relatedUrls": [
          {
            "url": "http://packetstormsecurity.com/files/155498/Bash-5.0-Patch-11-Privilege-Escalation.html",
            "label": ""
          },
          {
            "url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-18276",
            "label": ""
          },
          {
            "url": "https://github.com/bminor/bash/commit/951bdaad7a18cc0dc1036bba86b18b90874d39ff",
            "label": ""
          },
          {
            "url": "https://security.netapp.com/advisory/ntap-20200430-0003/",
            "label": ""
          },
          {
            "url": "https://www.youtube.com/watch?v=-wGtxJ8opa8",
            "label": ""
          }
        ],
        "effectiveSeverity": "LOW"
      }
    },
    {
      "name": "projects/rode/occurrences/d6d98c39-15bd-4dca-8a25-0b01ed3c2eb0",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "VULNERABILITY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "vulnerability": {
        "type": "docker",
        "severity": "SEVERITY_UNSPECIFIED",
        "cvssScore": 0,
        "packageIssue": [
          {
            "affectedLocation": {
              "cpeUri": "https://nvd.nist.gov/vuln/detail/TEMP-0841856-B18BAF",
              "package": "bash",
              "version": {
                "epoch": 0,
                "name": "bash",
                "revision": "",
                "kind": "NORMAL"
              }
            },
            "fixedLocation": null,
            "severityName": ""
          }
        ],
        "shortDescription": "",
        "longDescription": "",
        "relatedUrls": [],
        "effectiveSeverity": "LOW"
      }
    },
    {
      "name": "projects/rode/occurrences/d1d5cbc1-f7e0-4427-862d-29a60994bb69",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "VULNERABILITY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "vulnerability": {
        "type": "docker",
        "severity": "SEVERITY_UNSPECIFIED",
        "cvssScore": 0,
        "packageIssue": [
          {
            "affectedLocation": {
              "cpeUri": "https://nvd.nist.gov/vuln/detail/CVE-2016-2781",
              "package": "coreutils",
              "version": {
                "epoch": 0,
                "name": "coreutils",
                "revision": "",
                "kind": "NORMAL"
              }
            },
            "fixedLocation": null,
            "severityName": ""
          }
        ],
        "shortDescription": "chroot in GNU coreutils, when used with --userspec, allows local users to escape to the parent session via a crafted TIOCSTI ioctl call, which pushes characters to the terminal's input buffer.",
        "longDescription": "",
        "relatedUrls": [
          {
            "url": "http://seclists.org/oss-sec/2016/q1/452",
            "label": ""
          },
          {
            "url": "http://www.openwall.com/lists/oss-security/2016/02/28/2",
            "label": ""
          },
          {
            "url": "http://www.openwall.com/lists/oss-security/2016/02/28/3",
            "label": ""
          },
          {
            "url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-2781",
            "label": ""
          },
          {
            "url": "https://lore.kernel.org/patchwork/patch/793178/",
            "label": ""
          }
        ],
        "effectiveSeverity": "LOW"
      }
    },
    {
      "name": "projects/rode/occurrences/d534a727-0d2a-4792-b1ab-f9b7c3cf60fe",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "VULNERABILITY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "vulnerability": {
        "type": "docker",
        "severity": "SEVERITY_UNSPECIFIED",
        "cvssScore": 0,
        "packageIssue": [
          {
            "affectedLocation": {
              "cpeUri": "https://nvd.nist.gov/vuln/detail/CVE-2017-18018",
              "package": "coreutils",
              "version": {
                "epoch": 0,
                "name": "coreutils",
                "revision": "",
                "kind": "NORMAL"
              }
            },
            "fixedLocation": null,
            "severityName": ""
          }
        ],
        "shortDescription": "In GNU Coreutils through 8.29, chown-core.c in chown and chgrp does not prevent replacement of a plain file with a symlink during use of the POSIX \"-R -L\" options, which allows local users to modify the ownership of arbitrary files by leveraging a race condition.",
        "longDescription": "",
        "relatedUrls": [
          {
            "url": "http://lists.gnu.org/archive/html/coreutils/2017-12/msg00045.html",
            "label": ""
          }
        ],
        "effectiveSeverity": "LOW"
      }
    },
    {
      "name": "projects/rode/occurrences/86503ffc-4f8d-4dce-8ed9-1294a48d27f8",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "VULNERABILITY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:18Z",
      "updateTime": null,
      "vulnerability": {
        "type": "docker",
        "severity": "SEVERITY_UNSPECIFIED",
        "cvssScore": 0,
        "packageIssue": [
          {
            "affectedLocation": {
              "cpeUri": "https://nvd.nist.gov/vuln/detail/CVE-2020-8169",
              "package": "curl",
              "version": {
                "epoch": 0,
                "name": "curl",
                "revision": "",
                "kind": "NORMAL"
              }
            },
            "fixedLocation": null,
            "severityName": ""
          }
        ],
        "shortDescription": "curl 7.62.0 through 7.70.0 is vulnerable to an information disclosure vulnerability that can lead to a partial password being leaked over the network and to the DNS server(s).",
        "longDescription": "",
        "relatedUrls": [
          {
            "url": "https://curl.haxx.se/docs/CVE-2020-8169.html",
            "label": ""
          },
          {
            "url": "https://curl.se/docs/CVE-2020-8169.html",
            "label": ""
          },
          {
            "url": "https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-8169",
            "label": ""
          },
          {
            "url": "https://hackerone.com/reports/874778",
            "label": ""
          },
          {
            "url": "https://usn.ubuntu.com/usn/usn-4402-1",
            "label": ""
          }
        ],
        "effectiveSeverity": "HIGH"
      }
    },
    {
      "name": "projects/rode/occurrences/c5ff7eac-1447-44e0-8729-3aeb0a00c3cb",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "DISCOVERY",
      "remediation": "",
      "createTime": "2021-02-08T19:48:11Z",
      "updateTime": null,
      "discovered": {
        "discovered": {
          "continuousAnalysis": "CONTINUOUS_ANALYSIS_UNSPECIFIED",
          "lastAnalysisTime": null,
          "analysisStatus": "SCANNING",
          "analysisStatusError": null
        }
      }
    },
    {
      "name": "projects/rode/occurrences/b377cd00-5a64-40e4-a7a7-f33d4fe848b1",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "DISCOVERY",
      "remediation": "",
      "createTime": "2020-02-09T16:24:18Z",
      "updateTime": null,
      "discovered": {
        "discovered": {
          "continuousAnalysis": "CONTINUOUS_ANALYSIS_UNSPECIFIED",
          "lastAnalysisTime": null,
          "analysisStatus": "FINISHED_SUCCESS",
          "analysisStatusError": null
        }
      }
    },
    {
      "name": "projects/rode/occurrences/61896764-8967-4c11-86fc-941cefbcf5ae",
      "resource": {
        "name": "",
        "uri": "harbor.localhost/library/nginx@sha256:0b159cd1ee1203dad901967ac55eee18c24da84ba3be384690304be93538bea8",
        "contentHash": null
      },
      "noteName": "projects/rode/notes/harbor",
      "kind": "DISCOVERY",
      "remediation": "",
      "createTime": "2020-02-09T16:24:11Z",
      "updateTime": null,
      "discovered": {
        "discovered": {
          "continuousAnalysis": "CONTINUOUS_ANALYSIS_UNSPECIFIED",
          "lastAnalysisTime": null,
          "analysisStatus": "SCANNING",
          "analysisStatusError": null
        }
      }
    }
  ],
  "nextPageToken": ""
};