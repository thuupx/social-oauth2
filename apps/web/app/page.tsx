import { Header } from '@social-oauth2/ui';
import { LoginComponent } from '../components/Login';

export default function Page() {
  return (
    <>
      <Header text="Web" />
      <LoginComponent />
    </>
  );
}
