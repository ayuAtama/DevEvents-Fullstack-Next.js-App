const UserDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>User Details for User ID: {id}</div>;
};

export default UserDetails;

export async function generateStaticParams() {
  // Provide at least one param to satisfy Cache Components prerender requirement
  return [{ id: "example" }];
}