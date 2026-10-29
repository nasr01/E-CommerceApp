export interface RegisterRequest {
    name: string
    email: string
    password: string
    rePassword: string
    phone: string
}

export interface SuccessRegisterResponse {
    message: string
    user: {
        name: string
        email: string
        role: string
    }
}

export interface FailedRegisterResponse {
    message: string
    statusMsg?: string
    errors?: {
        value?: string
        msg: string
        param: string
        location: string
    }[]
}
