import axios from "axios";
import {
  Issue,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
  User,
} from "./types";
import { useAuthStore } from "./store";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined in .env file");
}

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function registerUser(user: User) {
  const response = await api.post<{ message: string } | undefined>(
    "/register",
    user,
  );
  return response.data;
}

export async function loginUser(user: User) {
  const response = await api.post<
    { message: string; accessToken: string } | undefined
  >("/login", user);
  return response.data;
}

export async function verifyJwtToken(authToken: string) {
  const response = await api.get<{ sub: string } | undefined>(
    "/verify-jwt-token",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.data;
}

export async function getAllUsers() {
  const response = await api.get<User[] | undefined>("/get-all-users");
  return response.data;
}

export async function getAllIssueStatus() {
  const response = await api.get<IssueStatus[] | undefined>("/issue-status");
  return response.data;
}

export async function getAllIssuePriority() {
  const response = await api.get<IssuePriority[] | undefined>(
    "/issue-priority",
  );
  return response.data;
}

export async function getAllIssueSeverity() {
  const response = await api.get<IssueSeverity[] | undefined>(
    "/issue-severity",
  );
  return response.data;
}

export async function createIssue(issue: Issue) {
  const response = await api.post<Issue | undefined>("/create-issue", issue);
  return response.data;
}

export async function getAllIssues() {
  const response = await api.get<Issue[] | undefined>("/get-all-issues");
  return response.data;
}

export async function getIssueById(issueId: string) {
  const response = await api.get<Issue | undefined>("/get-issue-by-id", {
    params: { issueId },
  });
  return response.data;
}

export async function updateIssue(issue: Issue) {
  const response = await api.put<Issue | undefined>("/update-issue", issue);
  return response.data;
}

export async function removeIssue(issueId: string) {
  const response = await api.delete<Issue | undefined>("/remove-issue", {
    params: { issueId },
  });
  return response.data;
}

export async function getOptionalFieldCount() {
  const response = await api.get<number>("/optional-field-count");
  return response.data;
}

export async function addOptionalFields(
  issueId: string,
  optionalField: { name: string; value: string }[],
) {
  const response = await api.post<Issue | undefined>("/add-optional-field", {
    issueId,
    optionalField,
  });
  return response.data;
}
export async function removeOptionalField(
  issueId: string,
  optionalFieldId: string,
) {
  const response = await api.delete<Issue | undefined>(
    "/remove-optional-field",
    {
      params: { issueId, optionalFieldId },
    },
  );
  return response.data;
}
