import { useAuth } from "~/modules/auth/auth.context";
import Header from "~/ui/Header";
import HeadingLogo from "~/ui/HeadingLogo";
import Navigation from "~/ui/Navigation";
import NavigationItem from "~/ui/NavigationItem";

export default function DefaultHomeNavigation() {
  const { isLoggedIn } = useAuth();

  return <Header>
    <HeadingLogo />

    <Navigation>
      <NavigationItem to="/">Home</NavigationItem>
      <NavigationItem to="/privacy-policy">Privacy Policy</NavigationItem>
      <NavigationItem>About us</NavigationItem>
      {/*<NavigationItem to="/auth/login">Login</NavigationItem>*/}
      {isLoggedIn && <NavigationItem to="/dashboard/payloads">Dashboard</NavigationItem>}
      {!isLoggedIn && <NavigationItem to="/auth/login">Login</NavigationItem>}
    </Navigation>
  </Header>
}
