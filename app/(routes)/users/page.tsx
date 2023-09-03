'use client';

import Icon from "@/components/Icon";
import { getUsers } from "app/helpers/importers/getUsers";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response: any = await getUsers();
        setUsers(response);
      } catch (error) {
        throw error;
      }
    }

    getAllUsers();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center space-y-4 w-full max-w-6xl m-auto py-4">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-zinc-950 rounded-lg overflow-hidden">
          <thead className="text-left text-zinc-1500 border-b border-zinc-900">
            <tr>
              <th className="px-0 py-3 font-medium" />
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Username</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => (
              <tr
                key={user.id}
                className={`last:border-transparent border-b border-zinc-900 ${index % 2 === 0 ? "bg-zinc-1000" : "bg-zinc-950"
                  } hover:bg-zinc-900 hover:border-zinc-950 transition duration-150 ease-in-out text-zinc-500 hover:text-zinc-100`}
              >
                <td className="px-0 pt-8 pb-6 whitespace-nowrap relative flex flex-col items-center">
                  {user.admin && (
                    <Icon icon="CrownSimple" className="w-4 h-4 fill-amber-500 absolute -translate-y-4" />
                  )}
                  <img
                    className={`w-12 h-12 rounded-full ${user.admin ? "border-2 border-amber-500" : "border-2 border-zinc-900"
                      }`}
                    src={user.avatar}
                    alt={user.name}
                  />
                </td>
                <td className="p-6 whitespace-nowrap">{user.name}</td>
                <td className="p-6 whitespace-nowrap">{user.username}</td>
                <td className="p-6 whitespace-nowrap">{user.email}</td>
                <td className="p-6 whitespace-nowrap">{user.admin ? 'Admin' : 'User'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UsersPage;
