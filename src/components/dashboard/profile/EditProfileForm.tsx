"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountApiError, listWallets } from "@/features/account";

const AvatarUpload = dynamic(
  () => import("./AvatarUpload").then((module) => module.AvatarUpload),
  {
    loading: () => (
      <div
        className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-muted"
        aria-label="Loading profile photo control"
      />
    ),
  },
);

const AccountOverviewTable = dynamic(() =>
  import("./AccountOverviewTable").then(
    (module) => module.AccountOverviewTable,
  ),
);

interface ProfileFormData {
  firstName: string;
  surnames: string;
  phone: string;
  countryCode: string;
  location: string;
  summary: string;
  avatar: File | null;
}

interface AccountData {
  createdAt: string;
  walletAddress: string | null;
  email: string;
}

const EMPTY_FORM: ProfileFormData = {
  firstName: "",
  surnames: "",
  phone: "",
  countryCode: "+506",
  location: "",
  summary: "",
  avatar: null,
};

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", label: "+1" },
  { code: "+44", flag: "🇬🇧", label: "+44" },
  { code: "+506", flag: "🇨🇷", label: "+506" },
  { code: "+52", flag: "🇲🇽", label: "+52" },
  { code: "+55", flag: "🇧🇷", label: "+55" },
  { code: "+34", flag: "🇪🇸", label: "+34" },
];

const UNSTORED_FIELDS_NOTE_ID = "profile-unstored-fields-note";

export function EditProfileForm() {
  const [form, setForm] = useState<ProfileFormData>(EMPTY_FORM);
  const [savedDisplayName, setSavedDisplayName] = useState("");
  const [account, setAccount] = useState<AccountData>({
    createdAt: "—",
    walletAddress: "No wallet linked",
    email: "—",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentDisplay = (user.displayName ?? "").trim();
        const parts = currentDisplay ? currentDisplay.split(" ") : [];
        const firstName = parts[0] ?? "";
        const surnames = parts.slice(1).join(" ");

        setSavedDisplayName(currentDisplay);
        setForm((prev) => ({
          ...prev,
          firstName,
          surnames,
        }));

        setAccount({
          createdAt: user.metadata.creationTime
            ? new Date(user.metadata.creationTime).toLocaleDateString("en-GB")
            : "—",
          walletAddress: "No wallet linked",
          email: user.email ?? "—",
        });
        void user
          .getIdToken()
          .then(listWallets)
          .then(
            ({ wallets }) => {
              const primaryWallet = wallets.find((wallet) => wallet.isPrimary);
              setAccount((current) => ({
                ...current,
                walletAddress: primaryWallet?.address ?? "No wallet linked",
              }));
            },
            (error: unknown) => {
              setAccount((current) => ({ ...current, walletAddress: null }));
              if (
                error instanceof AccountApiError &&
                error.code === "BACKEND_NOT_CONFIGURED"
              ) {
                return;
              }
              console.error("Failed to load linked wallet:", error);
              toast.error("Couldn't load your primary wallet.");
            },
          );
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange =
    (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const currentDisplayName = `${form.firstName} ${form.surnames}`.trim();
  const hasNameChanged =
    currentDisplayName.length > 0 && currentDisplayName !== savedDisplayName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasNameChanged) return;
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      await updateProfile(user, {
        displayName: currentDisplayName,
      });
      setSavedDisplayName(currentDisplayName);
      toast.success("Name updated.");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initials =
    [form.firstName[0], form.surnames[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  if (isInitializing) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Edit profile</h1>

      <div className="border border-border rounded-lg p-6 space-y-6">
        {/* Name row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className="mb-1.5 block">
              First Name
            </Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={handleChange("firstName")}
              placeholder="First name"
            />
          </div>
          <div>
            <Label htmlFor="surnames" className="mb-1.5 block">
              Surnames
            </Label>
            <Input
              id="surnames"
              value={form.surnames}
              onChange={handleChange("surnames")}
              placeholder="Last name"
            />
          </div>
        </div>

        <p
          id={UNSTORED_FIELDS_NOTE_ID}
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
        >
          Phone, location, summary and photo can&apos;t be saved yet.
          You&apos;ll be able to edit them when your account is connected to the
          SafeTrust backend.
        </p>

        {/* Avatar + Summary */}
        <div className="flex gap-4">
          <AvatarUpload
            initials={initials}
            disabled
            ariaDescribedBy={UNSTORED_FIELDS_NOTE_ID}
            onFileChange={(file) =>
              setForm((prev) => ({ ...prev, avatar: file }))
            }
          />
          <div className="flex-1 min-w-0">
            <Label htmlFor="summary" className="mb-1.5 block">
              Summary
            </Label>
            <Textarea
              id="summary"
              placeholder="Write a short bio..."
              value={form.summary}
              onChange={handleChange("summary")}
              disabled
              aria-describedby={UNSTORED_FIELDS_NOTE_ID}
              className="resize-none h-20"
            />
          </div>
        </div>

        {/* Phone + Location row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone" className="mb-1.5 block">
              Phone
            </Label>
            <div className="flex gap-2">
              <select
                aria-label="Country code"
                aria-describedby={UNSTORED_FIELDS_NOTE_ID}
                disabled
                value={form.countryCode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, countryCode: e.target.value }))
                }
                className="h-9 w-28 shrink-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-card"
              >
                {COUNTRY_CODES.map(({ code, flag, label }) => (
                  <option
                    key={code}
                    value={code}
                    className="bg-card text-foreground"
                  >
                    {flag} {label}
                  </option>
                ))}
              </select>
              <Input
                id="phone"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="Phone number"
                type="tel"
                autoComplete="tel-national"
                disabled
                aria-describedby={UNSTORED_FIELDS_NOTE_ID}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location" className="mb-1.5 block">
              Location
            </Label>
            <Input
              id="location"
              value={form.location}
              onChange={handleChange("location")}
              placeholder="City, Country"
              disabled
              aria-describedby={UNSTORED_FIELDS_NOTE_ID}
            />
          </div>
        </div>

        {/* Account overview — real Firebase data */}
        <AccountOverviewTable
          createdAt={account.createdAt}
          walletAddress={account.walletAddress}
          email={account.email}
        />

        {/* Save button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !hasNameChanged}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
