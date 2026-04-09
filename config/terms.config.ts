import { LegalPageConfig } from './types';

export const termsConfig: LegalPageConfig = {
    hero: {
        badge: "LEGAL DOCUMENT",
        title: "Terms &",
        subtitle: "Conditions",
        lastUpdated: "March 9, 2026"
    },
    sections: [
        {
            title: "1. Introduction",
            content: "Welcome to Moksha Sewa. These Terms and Conditions ('Terms') govern your use of our website, services, and any donations made to our organization. By accessing our website or making a donation, you agree to be bound by these Terms."
        },
        {
            title: "2. Acceptance of Terms",
            content: "By using our website, making a donation, or engaging with our services, you acknowledge that you have read and understood these Terms, agree to comply with all applicable laws, and are at least 18 years of age or have parental consent."
        },
        {
            title: "3. Donations",
            content: "All donations are voluntary and non-refundable except as specified in our Refund Policy. Donations are eligible for 80G tax exemption. Funds will be used for cremation services, ambulance operations, and administrative costs."
        },
        {
            title: "4. Intellectual Property",
            content: "All content on this website, including text, graphics, logos, and images, is the property of Moksha Sewa. You may not reproduce, distribute, or modify our content without written permission."
        }
    ],
    footer: {
        title: "Contact Information",
        content: "If you have any questions about these Terms & Conditions, please contact us.",
        contactEmail: "info@mokshasewa.org"
    }
};

export default termsConfig;
