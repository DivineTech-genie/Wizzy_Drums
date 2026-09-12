"use client";

import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  YoutubeLogoIcon,
  FacebookLogoIcon,
} from "@phosphor-icons/react";
import { Drum } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/hooks/admin/useSettings";

const renderBrandName = (name: string) => {
  const trimmedName = name?.trim() || "StageBook";
  const spacedName = trimmedName.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  const words = spacedName.split(/\s+/).filter(Boolean);
  const primaryWord = words[0] ?? trimmedName;
  const secondaryWords = words.length > 1 ? words.slice(1).join(" ") : "";

  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-primary">{primaryWord}</span>
      {secondaryWords && (
        <span className="text-foreground"> {secondaryWords}</span>
      )}
      <Drum className="h-4 w-4 text-primary" />
    </span>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const socialLinks = [
    {
      key: "instagram",
      href: settings.socials.instagram,
      icon: InstagramLogoIcon,
    },
    {
      key: "youtube",
      href: settings.socials.youtube,
      icon: YoutubeLogoIcon,
    },
    {
      key: "twitter",
      href: settings.socials.twitter,
      icon: TwitterLogoIcon,
    },
    {
      key: "facebook",
      href: settings.socials.facebook,
      icon: FacebookLogoIcon,
    },
  ].filter((link) => link.href);

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">
              {renderBrandName(settings.siteName)}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {settings.tagline || "Book unforgettable live performances."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/book"
                  className="hover:text-foreground transition-colors"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-foreground transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map(({ key, href, icon: Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                    aria-label={key}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Follow us on social media
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {currentYear} {settings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
