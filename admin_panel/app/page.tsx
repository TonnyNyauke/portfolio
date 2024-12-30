'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./context/auth-context";

export default function LoginPage() {
  const { signIn } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Portfolio Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Sign in to access the admin panel
          </p>
          <Button 
            onClick={signIn}
            className="w-full"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}