"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { useAppDispatch } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { api } from "@/app/services/api.service";
import { signOutUserAction } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const AccountSignOut = () => {
  const dispatch = useAppDispatch();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const onUserSignOut = async () => {
    setIsSigningOut(true);
    const response = await signOutUserAction();
    if (response.data === "success") {
      dispatch(api.util.resetApiState());
      setIsSigningOut(false);
      window.location.reload();
    }

    let errMessage = response.message;
    if (response.statusCode === 500) {
      errMessage = "Internal server error. Please try again later.";
    }

    setIsSigningOut(false);
    return toast.error(errMessage);
  };

  return (
    <Button
      onClick={onUserSignOut}
      className={cn("w-40", {
        "disable-element opacity-70": isSigningOut,
      })}
    >
      {isSigningOut && <Loader className="mr-2 size-4 animate-spin" />}
      Sign Out
    </Button>
  );
};

export default AccountSignOut;
