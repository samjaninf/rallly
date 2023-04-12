import { AdjustmentsIcon, LogoutIcon, UserIcon } from "@rallly/icons";
import Head from "next/head";
import Link from "next/link";
import * as React from "react";

import { UserDetails } from "./profile/user-details";
import { useUser } from "./user-provider";

export const Profile: React.FunctionComponent = () => {
  const { user } = useUser();

  return <UserDetails userId={user.id} name={user.name} email={user.email} />;
};
