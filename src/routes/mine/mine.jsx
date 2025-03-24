import { useEffect, useRef, useState } from "react"
import { Link, Navigate, Outlet, useActionData, useNavigate, useNavigation, useSubmit } from "react-router-dom"
import { HelpCircle, SaveAll, SquarePlus } from "lucide-react";
import CardForm from "../../components/CardForm"
import { addCardDocs } from "../../db";
import Loading from "../../components/Loading";
import { createEmptyForm } from "../../utils";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";

export async function action({ request }) {
  const requestJson = await request.json();
  const cardsData = requestJson.data;

  // Client Validation
  const errors = []
  for (const cardData of cardsData) {
    if (Object.values(cardData.data).includes("")) {
      errors.push(cardData.name);
    }
  }

  if (errors.length == 0) {
    const result = await addCardDocs(cardsData.map(card => card.data));
    toast.custom((t) => (<Toast message="Kartu ditambahkan" color="green" />));
    return { success: true };
  } else { // There empty input
    toast.custom((t) => (<Toast message="Terdapat kartu kosong" color="red" />));
    return { success: false, errors };
  }
}

export default function Mine() {

  const formContainerRef = useRef()
  const [randomNum, setRandomNum] = useState(Math.floor(Math.random() * 10));
  const [forms, setForms] = useState([createEmptyForm(1)]);
  const { success, errors } = useActionData() || {};
  const submit = useSubmit();
  const navigation = useNavigation();

  function handleFormChange(changedForm) {
    setForms(prevForms => {
      return prevForms.map(prevForm => {
        return prevForm.index == changedForm.index ? changedForm  : prevForm
      })
    });
  }

  function handleAddButton() {
    setForms(prevFormIndexes => {
      const {index} = prevFormIndexes.at(-1)
      return [...prevFormIndexes, createEmptyForm(index + 1)]
    });
  }

  function handleSubmitButton() {
    const cardForms = formContainerRef.current.querySelectorAll('form');
    const cardsData = Array.from(cardForms, form => ({ data: Object.fromEntries(new FormData(form)), name: form.name }));
    submit({ data: cardsData }, { method: "post", encType: "application/json" });
  }

  function handleCardsButtons(e) {
    if (e.target.tagName == "BUTTON") {
      const deletedFormIndex = e.target.parentElement.parentElement.dataset.formindex;
      setForms(prevFormIndexes => prevFormIndexes.filter(({index}) => index != deletedFormIndex));
    }
  }

  useEffect(() => {
    if (success) {
      setForms([createEmptyForm(1)]);
      setRandomNum(Math.floor(Math.random() * 10));
    }
  }, [success]);

  // Masonry
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const root = document.querySelector(':root');
  const style = window.getComputedStyle(root);
  const column = Number.parseInt(style.getPropertyValue('--column'));

  function resizeWindowHandler() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', resizeWindowHandler);
    return () => {
      window.removeEventListener('resize', resizeWindowHandler);
    };
  }, [])

  const formsMasonry = forms
    .reduce((array, form, index) => {
      index = index < column ? index : index % column;
      array[index] = [...array[index], form];
      return array
    }, (new Array(column)).fill([]))

  // Dialog

  const dialogRef = useRef();
  const navigate = useNavigate();

  function handleDialogOpen() {
    dialogRef.current.showModal();
  }

  function handleDialogClose() {
    dialogRef.current.close();
  }

  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      dialogRef.current.close();
      navigate('/mine');
    };
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      dialogRef.current.close();
      navigate('/mine');
    };
  }

  useEffect(() => {
    if (location.pathname !== "/mine") {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [location.pathname]);

  return success ? (
    <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
      <Loading className='flex-1 flex flex-col justify-center items-center' />
      <Navigate to={"/mine"} />
    </main>
  ) : (
    <main ref={formContainerRef} className="container w-dvw md:w-full flex-1 pb-2 px-2 flex flex-col bg-inherit">
      {navigation.state === "submitting" || navigation.state === "loading" ? (
        <Loading className='flex-1 flex flex-col justify-center items-center' />
      ) : (
        <>
          <section className="py-2 flex gap-2 sticky top-14 bg-inherit z-10 overflow-y-auto">
            <Link onClick={handleDialogOpen} className="p-2 flex items-center justify-center gap-2 bg-white text-nowrap shadow rounded-lg hover:shadow-md" to="help"><HelpCircle size={20} />Bantuan</Link>
            <button onClick={handleAddButton} className="p-2 flex-1 flex items-center justify-center gap-2 bg-white text-nowrap shadow rounded-lg hover:shadow-md"><SquarePlus size={20} />Tambah Kartu</button>
            <button onClick={handleSubmitButton} className="p-2 flex-1 flex items-center justify-center gap-2 bg-white text-nowrap shadow rounded-lg hover:shadow-md"><SaveAll size={20} />Simpan Kartu</button>
          </section>
          <section onClick={handleCardsButtons} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {formsMasonry.map((column, index) => (
              <div key={index} className="flex flex-col gap-2 relative">
                {column.map(form =>
                  <CardForm
                    key={`${randomNum}${form.index}`}
                    form={form}
                    cardCount={forms.length}
                    isError={errors ? errors.includes(`card_${form.index}`) : false}
                    handleFormChange={handleFormChange}
                  />
                )}
              </div>
            ))}
          </section>
        </>
      )}
      <dialog ref={dialogRef} onClick={handleBackdropClick} onKeyDown={handleEscDown} className="w-full max-h-[75dvh] sm:max-w-sm md:max-w-md bottom-0 rounded-lg">
        <Outlet context={[handleDialogClose]} />
      </dialog>
    </main>
  )
}