import Head from "next/head";

export default function Terms() {
  return (
    <>
      <HeadContent />
      <BodyContent />
    </>
  );
}

const HeadContent = () => (
  <Head>
    <title>KaiKul - Terms and Privacy Policy</title>
    <meta
      name="description"
      content="Terms of Service and Privacy Policy for KaiKul."
    />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

const BodyContent = () => (
  <div className="min-h-screen p-4 md:p-6 bg-slate-100 dark:bg-slate-900">
    <div className="container max-w-[600px] mx-auto p-6 rounded-lg shadow-md bg-slate-100 dark:bg-slate-800 space-y-8">
      <SectionHeader text="Terms of Service for KaiKul" />
      <Section
        title="Introduction"
        content="Welcome to KaiKul. By accessing our platform and using our services, you are agreeing to the following terms."
      />
      <Section
        title="Services Provided"
        content="KaiKul offers resources and tools related to personal development. Users can register to receive newsletters, updates, and in-app notifications."
      />
      <Section
        title="Registration"
        content="Users must provide accurate, current, and complete information during the registration process. Any false information can lead to termination of the account."
      />
      <Section
        title="Use of Services"
        content="Users are granted a limited, non-exclusive, non-transferable license to access and use our services. Misuse or unauthorized use is prohibited and may result in termination."
      />
      <Section
        title="Termination"
        content="We reserve the right to terminate or suspend any account if there's a violation of these terms or any suspicious activity."
      />
      <Section
        title="Emails and Communication"
        content="By registering, users agree to receive transactional and marketing emails. However, users can opt out of our mailing list at any time through the provided opt-out link in our emails."
      />

      <SectionHeader text="Privacy Policy for KaiKul" />
      <Section
        title="Information We Collect"
        content="We collect personal information such as email addresses when users register on our platform."
      />
      <Section
        title="How We Use the Information"
        content="The information collected is used to send newsletters, welcome emails, and in-app notifications to our users."
      />
      <Section
        title="Storage and Security"
        content="We store user data on Firebase. We employ security measures to protect your data but cannot guarantee absolute security."
      />
      <Section
        title="Sharing of Information"
        content="We do not sell or share user information with third parties unless required by law."
      />
      <Section
        title="Opting Out"
        content="Users have the right to opt out of our mailing list. By doing so, they will no longer receive newsletters or marketing emails, but transactional emails related to their account activities might still be sent."
      />
      <Section
        title="Changes to this Policy"
        content="We reserve the right to update or modify this policy. Any changes will be communicated to our users."
      />
    </div>
  </div>
);

interface SectionHeaderProps {
  text: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ text }) => (
  <h1 className="text-3xl font-bold mb-8 dark:text-gray-200">{text}</h1>
);

interface SectionProps {
  title: string;
  content: string;
}

const Section: React.FC<SectionProps> = ({ title, content }) => (
  <>
    <h2 className="text-xl font-semibold mt-6 mb-4 dark:text-gray-300">
      {title}
    </h2>
    <p className="mb-4 text-gray-700 dark:text-gray-400">{content}</p>
  </>
);
