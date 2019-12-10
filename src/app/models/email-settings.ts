export interface EmailSettings {
	id?: number;
	name?: string;
	subject?: string;
	content?: MarkdownContent;
	logo_url?: string;
	reply_to?: string;
	smtp_host?: string;
	smtp_port?: number;
	smtp_user?: string;
	smtp_password?: string;
	smtp_sender_name?: string;
	smtp_sender_email?: string;
	smtp_verified?: boolean;
	bcc_email?: string;
}

export type MarkdownContent = string;
