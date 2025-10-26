const UserDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>User Details for User ID: {id}</div>;
};

export default UserDetails;
