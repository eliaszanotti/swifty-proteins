export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Session {
	id: string;
	expiresAt: Date;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	ipAddress?: string;
	userAgent?: string;
	userId: string;
}

export interface RegisterInput {
	name: string;
	email: string;
	password: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	session: Session;
}

export interface AuthError {
	message: string;
	code?: string;
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}
