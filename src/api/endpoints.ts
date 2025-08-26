export const ENDPOINTS = {
  user: {
    signup: "/user/sign-up",
    login: "/user/login",
    logout: "/user/logout",
    update: (userId: string) => `/user/${userId}/update`
  },
  session: {
    userSessionInfo: "/session/user-info"
  },
  group: {
    create: "/group/create",
    get: (groupId: string) => `/group/${groupId}`,
    addMember: (groupId: string) => `/group/${groupId}/add-member`,
    remove: (groupId: string, memberId: string) => `/group/${groupId}/remove-member/${memberId}`,
    getAll: (userId: string) => `/group/get-all/${userId}`,
  },
  assignment: {
    create: "/assignment/create",
    get: (assignmentId: string) => `/assignment/${assignmentId}`,
    addTask: (taskId: string) => `/assignment/${taskId}/add-task`,
    getAll: (userId: string) => `/assignment/get-all/${userId}`,
    markTaskAsComplete: (assignmentId: string, taskId: string ) => `/assignment/${assignmentId}/task/${taskId}/complete`,
    assignTaskTo: (assignmentId: string) => `/assignment/${assignmentId}/assign-to`
  }
}