import React, { useContext, useEffect, useState } from "react";
import { BookContext } from "../../context/BookContext";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { booksAPI } from "../../services/api";
import { authorsAPI } from "../../services/api";
import { Author } from "../../types";
import Swal from "sweetalert2";

const BookPage: React.FC = () => {
  const context = useContext(BookContext);
  const [authors, setAuthors] = useState<Author[]>([]);

  if (!context) return <div>Loading...</div>;

  // const { books } = context;
  const { books, getBooks } = context;

  useEffect(() => {
    const fetchAuthors = async () => {
      const res = await authorsAPI.getAll();

      setAuthors(res);
    };

    fetchAuthors();
  }, []);

  const handleAddBook = async () => {
    const authorOptions = authors
      .map((a) => `<option value="${a.id}">${a.name}</option>`)
      .join("");
    const { value: formValues } = await Swal.fire({
      title: "เพิ่มหนังสือใหม่",
      html: `
      <input id="book-title" class="swal2-input" placeholder="ชื่อหนังสือ">
         <select id="book-author" class="swal2-input custom-select">
      <option value="">เลือกผู้แต่ง</option>
      ${authorOptions}
    </select>

      <input id="book-price" type="number" class="swal2-input" placeholder="ราคา (บาท)">
      <input id="book-img" class="swal2-input" placeholder="ลิงก์รูปภาพ (URL)">
      <input id="book-pdf" class="swal2-input" placeholder="ลิงก์หนังสือ (URL)">
      <input id="stock_quantity" class="swal2-input" placeholder="จำนวนสินค้า (เล่ม)">
      <input id="public_date" class="swal2-input" placeholder="วันที่เผยแพร่ (YY-MM-DD)">
      <label style="margin-top:10px; display:flex; align-items:center; gap:8px;">
      <input id="is_recommended" type="checkbox"> สินค้าแนะนำ
    </label>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        const title = (
          document.getElementById("book-title") as HTMLInputElement
        ).value;
        const author_id = (
          document.getElementById("book-author") as HTMLSelectElement
        ).value;
        const price = (
          document.getElementById("book-price") as HTMLInputElement
        ).value;
        const img_url = (
          document.getElementById("book-img") as HTMLInputElement
        ).value;
        const pdf_url = (
          document.getElementById("book-pdf") as HTMLInputElement
        ).value;
        const stock_quantity = (
          document.getElementById("stock_quantity") as HTMLInputElement
        ).value;
        const public_date = (
          document.getElementById("public_date") as HTMLInputElement
        ).value;
        const is_recommended = (
          document.getElementById("is_recommended") as HTMLInputElement
        ).checked;
        if (!title || !author_id || !price) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
          return;
        }

        return {
          title,
          price: parseFloat(price),
          file_url: pdf_url,
          img_url,
          author_ids: [Number(author_id)],
          stock_quantity: Number(stock_quantity),
          publication_date: public_date,
          is_recommended,
        };
      },
    });
    console.log(formValues);
    if (formValues) {
      await booksAPI.create(formValues);
      await Swal.fire({
        title: "เพิ่มหนังสือสำเร็จ",
        text: `คุณทำการเพิ่มหนังสือ "${formValues.title}" สำเร็จ`,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "สำเร็จ",
      });

      getBooks();
    }
  };
  const handleDeleteBook = async (id: number, title: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบหนังสือ "${title}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await booksAPI.delete(id);
        toast.success(`ลบหนังสือ "${title}" แล้ว`);
        await getBooks(); // โหลดข้อมูลใหม่
      } catch (err) {
        toast.error("ลบไม่สำเร็จ");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายชื่อหนังสือ</h1>

        <Button className="flex justify-center items-center" onClick={handleAddBook} variant="outline">
          + เพิ่มหนังสือ
        </Button>
      </div>
      <div className="p-6">
        {books && books.length === 0 ? (
          <p className="text-center text-gray-500 text-xl py-10">
            📚 ไม่มีหนังสือในระบบ
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg"
              >
                <img
                  src={book.img_url}
                  alt={book.title}
                  className="w-full h-60 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-500 text-sm">
                  by {book.authors.map((a) => a.name).join(", ")}
                </p>
                <p className="text-blue-600 font-bold mt-2">
                  ${book.price.toFixed(2)}
                </p>

                <Button
                  className="mt-3 w-full bg-red-500 text-white"
                  onClick={() => handleDeleteBook(book.id, book.title)}
                >
                  ลบหนังสือ
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
