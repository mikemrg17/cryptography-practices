import Marley from "@/components/practices/Marley";
import Shift from "@/components/practices/Shift";
import MultiplicativeInverses from "@/components/practices/MultiplicativeInverses";
import RSAKeys from "@/components/practices/RSAKeys";
import DigitalSign from "@/components/practices/DigitalSign";
import DiffieHellman from "@/components/practices/DiffieHellman";

export const TABS = [
  {
    id: 0,
    label: "Marley",
    content: Marley,
  },
  {
    id: 1,
    label: "Corrimiento",
    content: Shift,
  },
  {
    id: 2,
    label: "Inversos multiplicativos",
    content: MultiplicativeInverses,
  },
  {
    id: 6,
    label: "Llaves RSA",
    content: RSAKeys,
  },
  {
    id: 7,
    label: "Firma digital",
    content: DigitalSign,
  },
  {
    id: 8,
    label: "Diffie Hellman",
    content: DiffieHellman,
  },
];
