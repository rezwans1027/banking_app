// import React, { useCallback, useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
// import { useRouter } from "next/navigation";
// import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions";
// import { parseStringify } from "@/lib/utils";

// const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
//   const [token, setToken] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const getLinkToken = async () => {
//       const linkToken = await createLinkToken(user)
//       setToken(linkToken);
//     };

//     getLinkToken();
//   }, [user]);

//   const onSuccess = useCallback<PlaidLinkOnSuccess>(
//     async (public_token: string) => {
//       await exchangePublicToken({publicToken: public_token, user})
//       router.push("/");
//     },
//     [user]
//   );

//   const config: PlaidLinkOptions = {
//     token,
//     onSuccess,
//   };

//   const { open, ready, } = usePlaidLink(config);

//   return (
//     <>
//       {variant === "primary" ? (
//         <Button className="plaidlink-primary" onClick={() => open()} disabled={!ready}>Connect bank</Button>
//       ) : variant === "ghost" ? (
//         <Button>Connect bank</Button>
//       ) : (
//         <Button>Connect bank</Button>
//       )}
//     </>
//   );
// };

// export default PlaidLink;

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";

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
        <Button>Connect bank</Button>
      ) : (
        <Button>Connect bank</Button>
      )}
    </>
  );
};

export default PlaidLink;

