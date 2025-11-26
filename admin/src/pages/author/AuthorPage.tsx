import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { authorsAPI } from "../../services/api";
import { Author } from "../../types";
import Swal from "sweetalert2";

const AuthorPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const loadAuthors = async () => {
    try {
      const res = await authorsAPI.getAll();
      setAuthors(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);
  const handleDeleteAuthor = async (author: Author) => {
    const confirm = await Swal.fire({
      title: `ลบผู้เขียน?`,
      text: `คุณต้องการลบ "${author.name}" ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    try {
      await authorsAPI.delete(author.id);

      await Swal.fire({
        title: "ลบสำเร็จ",
        text: `ลบผู้เขียน ${author.name} แล้ว`,
        icon: "success",
      });

      loadAuthors(); // refresh UI
    } catch (err: any) {
      console.error(err);

      Swal.fire({
        title: "ลบไม่สำเร็จ",
        text:
          err?.response?.data?.error ||
          "ไม่สามารถลบผู้เขียนได้ อาจมีหนังสือที่เชื่อมอยู่",
        icon: "error",
      });
    }
  };
  const handleAddAuthor = async () => {
    const { value: formValues } = await Swal.fire({
      title: "เพิ่มผู้เขียนใหม่",
      html: `
        <input id="author-first" class="swal2-input" placeholder="ชื่อจริง (First Name)">
        <input id="author-last" class="swal2-input" placeholder="นามสกุล (Last Name)">
        <input id="author-img" class="swal2-input" placeholder="ลิงก์รูปผู้เขียน (Image URL)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        const first_name = (
          document.getElementById("author-first") as HTMLInputElement
        ).value;
        const last_name = (
          document.getElementById("author-last") as HTMLInputElement
        ).value;
        const image_url = (
          document.getElementById("author-img") as HTMLInputElement
        ).value;

        if (!first_name || !last_name) {
          Swal.showValidationMessage("กรุณากรอกชื่อ และนามสกุล!");
          return;
        }

        return { first_name, last_name, image_url };
      },
    });

    if (formValues) {
      try {
        await authorsAPI.create(formValues);

        await Swal.fire({
          title: "เพิ่มผู้เขียนสำเร็จ",
          text: `เพิ่มผู้เขียน ${formValues.first_name} ${formValues.last_name} สำเร็จ`,
          icon: "success",
          confirmButtonText: "ตกลง",
        });

        loadAuthors();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเพิ่มผู้เขียนได้",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายชื่อผู้เขียน</h1>

        <Button variant="outline" onClick={handleAddAuthor}>
          + เพิ่มผู้เขียน
        </Button>
      </div>

      {authors.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-10">
          ไม่มีข้อมูลผู้เขียน
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {authors.map((a) => (
            <div
              key={a.id}
              className="border rounded-xl p-5 shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center">
                {a.image_url ? (
                  <img
                    src={a.image_url}
                    alt={a.name}
                    className="w-32 h-32 object-cover rounded-full mb-4 shadow"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{a.name}</h3>
              </div>

              <Button className="w-full mt-4 bg-red-500 text-white hover:bg-red-600" onClick={() => handleDeleteAuthor(a)}
>
                ลบผู้เขียน
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
