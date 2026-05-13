import { LoginForm } from '../components/LoginForm';
import { PageShell } from '../components/layout/PageShell';

export default function LoginPage() {
  return (
    <PageShell
      title="Secure access for team members"
      subtitle="Use CloudCart AI auth scaffolding to connect the storefront and API with JWT-based login flows."
    >
      <div className="mx-auto max-w-xl">
        <LoginForm />
      </div>
    </PageShell>
  );
}
