import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const [token, setToken] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getLinkToken = async () => {
      const linkToken = await createLinkToken(user);
      setToken(linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback(
    async (public_token: string) => {
      setIsLinking(true);
      try {
        await exchangePublicToken({ publicToken: public_token, user });
        router.push("/");
      } catch (error) {
        console.error(error);
        setIsLinking(false);
      }
    },
    [user, router]
  );

  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          className="plaidlink-primary"
          onClick={() => open()}
          disabled={!ready || isLinking}
        >
          {isLinking ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              &nbsp; Linking...
            </>
          ) : (
            "Connect bank"
          )}
        </Button>
      ) : variant === "ghost" ? (
        <Button
          className="plaidlink-ghost"
          variant="ghost"
          onClick={() => open()}
        >
          <Image
            src={"/icons/connect-bank.svg"}
            width={24}
            height={24}
            alt="Connect Bank"
          />
          <p className="text-[16px] font-semibold hidden xl:block text-black-2">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button className="plaidlink-default p-3 mt-[6.2px]" onClick={() => open()}>
          <Image
            src={"/icons/connect-bank.svg"}
            width={24}
            height={24}
            alt="Connect Bank"
          />
          <p className="text-[16px] hidden xl:block font-semibold text-black-2">Connect bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
