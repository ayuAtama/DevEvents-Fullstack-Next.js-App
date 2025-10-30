//const UserDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
//  const { id } = await params;
//  return <div>User Details for User ID: {id}</div>;
//};

//export default UserDetails;

const UserDetails = ({ params }: { params: { id: string } }) => {
  // If you want to fetch data about the user, do it here, possibly with async/await
  // const user = await fetchUser(params.id); // if needed and if component is 'async'
  return <div>User Details for User ID: {params.id}</div>;
};

export default UserDetails;