
export interface SuccessLoiginResponse {
    message: string,
    user: UserResponse,
    token: string,
}
export interface FaildLoiginResponse {
    message: string,
    statusMsg: string
}

export interface UserResponse {
    name: string,
    email: string,
    role: string
}