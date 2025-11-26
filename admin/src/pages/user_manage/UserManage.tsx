import React, { useEffect, useState } from "react";
import { usersAPI } from "../../services/api";
import { User } from "../../types";
import Swal from "sweetalert2";

const UserManage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");

  const loadUsers = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res);
    } catch (err) {
      console.error("Error loading users:", err);
      Swal.fire("Error", "โหลดข้อมูลผู้ใช้ไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();

    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.name.toLowerCase().includes(q)
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const handleChangeRole = async (user: User, newRoleId: number) => {
    try {
      await usersAPI.updateRole(user.id, newRoleId);

      Swal.fire({
        title: "สำเร็จ!",
        text: `เปลี่ยน role ของ ${user.username} เรียบร้อย`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      loadUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "ไม่สามารถเปลี่ยน Role ได้", "error");
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้</h1>
      <input
        type="text"
        placeholder="ค้นหาผู้ใช้ (ชื่อ อีเมล หรือ role)"
        className="border p-3 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">ไม่พบผู้ใช้ที่ตรงกับการค้นหา</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-3">ID</th>
                <th className="border p-3">Username</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Role</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border p-3">{u.id}</td>
                  <td className="border p-3">{u.username}</td>
                  <td className="border p-3">{u.email}</td>
                  <td className="border p-3 font-semibold">
                    <select
                      className="border rounded p-2"
                      value={u.role.id}
                      onChange={(e) =>
                        handleChangeRole(u, Number(e.target.value))
                      }
                    >
                      <option value={2}>Admin</option>
                      <option value={1}>Customer</option>
                      <option value={3}>Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManage;
