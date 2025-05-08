"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile, useClerk, useUser } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-[250px] mx-auto" />
          <Skeleton className="h-4 w-[200px] mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" text-white py-12  bg-gradient-to-b from-black/80 to-black/90">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-10 w-10 text-black"
              onClick={() => openUserProfile()}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>

            <Button
              variant="outline"
              className="mt-4 text-black"
              onClick={() => {
                openUserProfile();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Account Information */}
        <Card className=" bg-gray-950 text-white border border-gray-800">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Username</Label>
                <p>{user.username || "Not set"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">User ID</Label>
                <p className="truncate">{user.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p>{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email Verified</Label>
                <p>
                  {user.primaryEmailAddress?.verification.status === "verified"
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className=" bg-gray-950 text-white border border-gray-800">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Label>Password</Label>
                <p className="text-muted-foreground">••••••••</p>
              </div>
              <Button
                className=" text-black"
                variant="outline"
                onClick={() => openUserProfile()}
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced */}
        <Card className=" bg-gray-950 text-white border border-gray-800">
          <CardHeader>
            <CardTitle>Advanced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Label>Delete Account</Label>
                <p className="text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" onClick={() => openUserProfile()}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clerk User Profile Modal */}
        <UserProfile
          appearance={{
            elements: {
              rootBox: "hidden",
              card: "shadow-none",
            },
          }}
        />
      </div>
    </div>
  );
}
