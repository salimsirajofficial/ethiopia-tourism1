import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-2xl rounded-3xl bg-background">
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              This screen isn’t implemented yet in the split micro-frontend.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/login">Back to login</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <a href="mailto:support@example.com">Contact support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

