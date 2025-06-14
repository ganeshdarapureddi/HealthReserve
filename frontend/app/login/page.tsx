import LoginForm from '@/app/ui/login/login-form';
import './login.css';

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login-image.jpg')",
        backgroundPosition: '65% center',
       }}
    >
      <LoginForm />
    </div>
  );
}
