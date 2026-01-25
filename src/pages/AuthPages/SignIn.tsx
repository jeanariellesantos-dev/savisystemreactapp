import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Submission and Approval System"
        description="This is the signin page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
