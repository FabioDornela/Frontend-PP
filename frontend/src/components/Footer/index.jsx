import React from "react";
import { PawPrint } from "lucide-react";
import "./styles.scss";

export default function Footer() {
  return (
    <footer className="portalpet-footer">
      <PawPrint className="portalpet-footer__paw left" size={32} />

      <div className="portalpet-footer__center">
        <span className="line" />
        <span className="word">ADOTE</span>
        <span className="dot">•</span>
        <span className="word">CUIDE</span>
        <span className="dot">•</span>
        <span className="word">TRANSFORME</span>
        <span className="line" />
      </div>

      <PawPrint className="portalpet-footer__paw right" size={32} />
    </footer>
  );
}
