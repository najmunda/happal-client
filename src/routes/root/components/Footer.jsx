import Navigation from "./Navigation";
import Card from "../../../components/Card";

export default function Footer() {
  return (
    <Card
      as="footer"
      className="w-dvw md:w-full order-last flex md:hidden rounded-none rounded-t-lg"
    >
      <nav className="flex-1 md:hidden">
        <Navigation />
      </nav>
    </Card>
  );
}
