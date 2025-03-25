import React from "react";
import UsersMenu from "../components/UsersMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px_1fr]">
        {/* left menu */}
        <div className="py-4 sticky top-24 overflow-auto hidden lg:block">
          <UsersMenu />
        </div>

        {/*right content  */}
              <div className="bg-white p-4">
                  <Outlet/>
              </div>
      </div>
    </section>
  );
};

export default Dashboard;
