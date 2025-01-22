export default function UserProfile({ params }: any) {
  return (
    <div>
      <h1>User Profile</h1>
      <p>Here is the user profile for user with ID {params.id}</p>
    </div>
  );
}
