import { LegalPageConfig } from './types';

export const privacyConfig: LegalPageConfig = {
    hero: {
        badge: "LEGAL & TRUST",
        title: "PRIVACY",
        subtitle: "AND POLICY",
        lastUpdated: "March 2024"
    },
    sections: [
        {
            title: "Data Collection",
            icon: "Eye",
            content: "We collect only the most essential information required to fulfill our mission. This includes contact details provided during donation, volunteer registration, or while reporting an unclaimed body. We do not sell or trade your personal data with third-party commercial entities."
        },
        {
            title: "How We Use Data",
            icon: "FileText",
            content: "Information collected is used strictly for operational purposes: verifying reports, processing donations, issuing tax-exemption certificates (80G), and maintaining the Wall of Remembrance. Your data helps us maintain absolute transparency in our audit trails."
        },
        {
            title: "Security Measures",
            icon: "Lock",
            content: "We employ industry-standard encryption and secure server protocols to protect your sensitive information. Our 'Transparency Dashboard' anonymizes sensitive personal data while still providing public accountability for our mission's impact."
        }
    ],
    sidebar: {
        title: "Institutional Trust",
        content: "Our legal framework is built to ensure that every rupee spent and every soul served is accounted for in the public interest.",
        buttonText: "Read Compliance",
        buttonHref: "/compliance",
        icon: "Shield"
    },
    footer: {
        title: "Grievance Officer",
        content: "If you have any concerns regarding your data, contact our Nodal Officer.",
        contactEmail: "help@mokshasewa.org"
    }
};

export default privacyConfig;
