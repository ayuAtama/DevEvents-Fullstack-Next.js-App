const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>Navbar</div>
      {children}
    </>
  );
};

export default layout;
