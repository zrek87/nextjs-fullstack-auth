import React from "react";

interface UserProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserProfile({ params }: UserProfileProps) {
  const [id, setId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h1 className="user-profile-title">User Profile</h1>
        <p className="user-profile-subtitle">Welcome to the profile page!</p>
      </div>
      <div className="user-profile-content">
        <div className="user-profile-info">
          {id ? (
            <>
              <p className="user-profile-id">
                User ID: <span className="user-id">{id}</span>
              </p>
              <p className="user-profile-description">
                This is the profile page for the user with the above ID. Here
                you can find more details about the user, their activity, and
                other relevant information.
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="user-profile-actions">
          <button className="user-profile-button">Edit Profile</button>
          <button className="user-profile-button">View Activity</button>
          <button className="user-profile-button">Send Message</button>
        </div>
      </div>
    </div>
  );
}
