import { useRef } from "react";
import { Link } from "react-router-dom";
import { BookA, CalendarPlus, Crosshair, Search, SquarePen, Trash2, WholeWord } from "lucide-react"

const data = [
  { "id": 1, "sentence": "Maecenas pulvinar lobortis est.", "target": "adipiscing", "definition": "Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.", "dateAdded": "8/17/2024" },
  { "id": 2, "sentence": "In congue. Etiam justo.", "target": "enim", "definition": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.", "dateAdded": "9/26/2024" },
  { "id": 3, "sentence": "Donec ut mauris eget massa tempor convallis.", "target": "cras", "definition": "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.", "dateAdded": "12/13/2024" },
  { "id": 4, "sentence": "Nullam molestie nibh in lectus.", "target": "sed", "definition": "Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.", "dateAdded": "1/20/2024" },
  { "id": 5, "sentence": "Vivamus tortor. Duis mattis egestas metus.", "target": "mauris", "definition": "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.", "dateAdded": "1/7/2024" },
  { "id": 6, "sentence": "Donec posuere metus vitae ipsum. Aliquam non mauris.", "target": "porttitor", "definition": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.", "dateAdded": "2/22/2024" },
  { "id": 7, "sentence": "Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.", "target": "mauris", "definition": "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia.", "dateAdded": "1/17/2024" },
  { "id": 8, "sentence": "Phasellus in felis. Donec semper sapien a libero.", "target": "vel", "definition": "In quis justo.", "dateAdded": "9/10/2024" },
  { "id": 9, "sentence": "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.", "target": "bibendum", "definition": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.", "dateAdded": "8/28/2024" },
  { "id": 10, "sentence": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.", "target": "dolor", "definition": "Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo.", "dateAdded": "1/26/2024" },
  { "id": 11, "sentence": "Mauris lacinia sapien quis libero.", "target": "sem", "definition": "Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.", "dateAdded": "9/5/2024" },
  { "id": 12, "sentence": "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.", "target": "lobortis", "definition": "Integer ac neque.", "dateAdded": "8/20/2024" },
  { "id": 13, "sentence": "Pellentesque at nulla. Suspendisse potenti.", "target": "proin", "definition": "Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.", "dateAdded": "5/2/2024" },
  { "id": 14, "sentence": "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.", "target": "magna", "definition": "Donec quis orci eget orci vehicula condimentum.", "dateAdded": "10/18/2024" },
  { "id": 15, "sentence": "Phasellus sit amet erat.", "target": "libero", "definition": "Morbi quis tortor id nulla ultrices aliquet.", "dateAdded": "4/17/2024" },
  { "id": 16, "sentence": "Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.", "target": "venenatis", "definition": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.", "dateAdded": "8/11/2024" },
  { "id": 17, "sentence": "Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.", "target": "faucibus", "definition": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus.", "dateAdded": "1/4/2024" },
  { "id": 18, "sentence": "In sagittis dui vel nisl.", "target": "accumsan", "definition": "Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.", "dateAdded": "12/11/2024" },
  { "id": 19, "sentence": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.", "target": "habitasse", "definition": "Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.", "dateAdded": "3/17/2024" },
  { "id": 20, "sentence": "Quisque id justo sit amet sapien dignissim vestibulum.", "target": "vel", "definition": "Phasellus sit amet erat.", "dateAdded": "11/29/2024" },
  { "id": 21, "sentence": "Aenean lectus. Pellentesque eget nunc.", "target": "eu", "definition": "Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.", "dateAdded": "8/27/2024" },
  { "id": 22, "sentence": "Ut tellus. Nulla ut erat id mauris vulputate elementum.", "target": "sem", "definition": "Pellentesque at nulla.", "dateAdded": "3/4/2024" },
  { "id": 23, "sentence": "In sagittis dui vel nisl. Duis ac nibh.", "target": "ipsum", "definition": "Nullam varius. Nulla facilisi.", "dateAdded": "8/3/2024" },
  { "id": 24, "sentence": "Cras non velit nec nisi vulputate nonummy.", "target": "magnis", "definition": "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti.", "dateAdded": "5/16/2024" },
  { "id": 25, "sentence": "Nam dui.", "target": "non", "definition": "Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.", "dateAdded": "7/27/2024" },
  { "id": 26, "sentence": "Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.", "target": "tincidunt", "definition": "Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.", "dateAdded": "10/4/2024" },
  { "id": 27, "sentence": "Phasellus id sapien in sapien iaculis congue.", "target": "donec", "definition": "In eleifend quam a odio.", "dateAdded": "5/8/2024" },
  { "id": 28, "sentence": "Maecenas ut massa quis augue luctus tincidunt.", "target": "mi", "definition": "Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit.", "dateAdded": "5/13/2024" },
  { "id": 29, "sentence": "Nullam varius. Nulla facilisi.", "target": "augue", "definition": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique.", "dateAdded": "3/6/2024" },
  { "id": 30, "sentence": "Etiam justo. Etiam pretium iaculis justo.", "target": "quam", "definition": "Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.", "dateAdded": "4/22/2024" }
]

export default function Cards() {

  return (
    <>
      <form action="" className="p-2 flex items-center border rounded">
        <input type="search" name="" id="" className="w-full outline-0" />
        <Search />
      </form>
      <table className="p-2 w-full table-fixed border rounded">
        <thead>
          <tr>
            <th className="p-2 w-4/12"><div className="flex justify-center items-center gap-2"><WholeWord />Sentence</div></th>
            <th className="w-2/12"><div className="flex justify-center items-center gap-2"><Crosshair />Target</div></th>
            <th className="w-5/12"><div className="flex justify-center items-center gap-2"><BookA />Definition</div></th>
            <th className="w-1/12"><div className="flex justify-center items-center gap-2"><CalendarPlus />Added</div></th>
          </tr>
        </thead>
        <tbody>
          {data.map(card => (
            <tr key={card.id} data-key={card.id} className="group border relative">
              <td className="p-2 text-nowrap truncate">{card.sentence}</td>
              <td className="text-center text-nowrap truncate">{card.target}</td>
              <td className="text-nowrap truncate">{card.definition}</td>
              <td className="text-center text-nowrap truncate">{card.dateAdded}</td>
              <td className="h-full absolute right-0">
                <div className="h-full px-4 bg-white opacity-0 flex justify-center items-center gap-3 group-hover:opacity-100">
                  <button><SquarePen size={18} /></button>
                  <button><Trash2 size={18} color="red" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}