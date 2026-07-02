import {IEmailProvider} from "../../../infrastructure/providers/email/IEmailProvider.js";
import {TemplateService} from "../../../infrastructure/templates/TemplateService.js";
import {EmailRecipient} from "../../../infrastructure/providers/email/types.js";

const EMAIL_CATEGORY = {
    VERIFICATION: "Email Verification",
    RESET_REQUEST: "Password Reset Request",
    RESET_SUCCESS: "Password Reset Success"
};

const EMAIL_SUBJECT = {
    VERIFICATION: "Verify Your Email",
    RESET_REQUEST: "Reset Your Password",
    RESET_SUCCESS: "Password Reset Successful"
};

const TEMPLATE_PATH = {
    VERIFICATION: "emailVerification.html",
    RESET_REQUEST: "passwordResetRequest.html",
    RESET_SUCCESS: "passwordResetSuccess.html"
}

export class EmailNotificationService {
    constructor(
        private readonly emailProvider: IEmailProvider,
        private readonly templateService: TemplateService,
        private readonly resetPasswordUrlBase: string,
        private readonly appName: string,
    ) {}

    async sendEmailVerification(recipient: EmailRecipient, token: string): Promise<void> {
        const html = await this.templateService.replacePlaceholders(
            TEMPLATE_PATH.VERIFICATION,
            { verificationCode: token, appName: this.appName }
        );

        await this.emailProvider.send(recipient, EMAIL_SUBJECT.VERIFICATION, html, EMAIL_CATEGORY.VERIFICATION);
    }

    async sendPasswordReset(recipient: EmailRecipient, token: string): Promise<void> {
        const html = await this.templateService.replacePlaceholders(
            TEMPLATE_PATH.RESET_REQUEST,
            { resetPasswordUrl: `${this.resetPasswordUrlBase}/${token}`, appName: this.appName }
        );

        await this.emailProvider.send(recipient, EMAIL_SUBJECT.RESET_REQUEST, html, EMAIL_CATEGORY.RESET_REQUEST);
    }

    async sendPasswordResetSuccess(recipient: EmailRecipient): Promise<void> {
        const html = await this.templateService.replacePlaceholders(
            TEMPLATE_PATH.RESET_SUCCESS,
            { appName: this.appName }
        );

        await this.emailProvider.send(recipient, EMAIL_SUBJECT.RESET_SUCCESS, html, EMAIL_CATEGORY.RESET_SUCCESS);
    }
}