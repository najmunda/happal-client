import { useEffect, useRef, useState } from "react";
import {
  Navigate,
  Outlet,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { SaveAll, SquarePlus } from "lucide-react";
import CardForm from "./components/CardForm";
import Loading from "../../components/Loading";
import { createEmptyForm } from "../../utils/utils";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { logError } from "../../utils/logger";
import { addCardDocs } from "./db";
import Card from "../../components/Card";
import Dialog from "../../components/Dialog";

export function shouldRevalidate() {
  return false;
}

export async function loader() {
  const draftCardsData = JSON.parse(localStorage.getItem("happal-mine-draft"));
  return {
    draftCardsData,
  };
}

export async function action({ request }) {
  try {
    const requestJson = await request.json();
    const intent = requestJson.intent;
    const cardsData = requestJson.data;
    switch (intent) {
      case "add": {
        // Client Validation
        const errors = [];
        for (const cardData of cardsData) {
          if (Object.values(cardData.data).includes("")) {
            errors.push(cardData.name);
          }
        }

        if (errors.length !== 0) {
          // There empty input
          toast.custom(() => (
            <Toast message="Terdapat kartu kosong" type="error" />
          ));
          return { success: false, errors };
        } else {
          const response = await addCardDocs(
            cardsData.map((card) => card.data),
          );
          localStorage.removeItem("happal-mine-draft");
          toast.custom(() => (
            <Toast message={response.message} type="success" />
          ));
          return { success: response.success };
        }
      }
      case "draft": {
        localStorage.setItem("happal-mine-draft", JSON.stringify(cardsData));
        return null;
      }
      default:
        return null;
    }
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Seluruh kartu gagal ditambahkan";
    toast.custom(() => <Toast message={error.message} type="error" />);
    return { success: false };
  }
}

export function Component() {
  const formContainerRef = useRef();
  const { draftCardsData } = useLoaderData();
  const [randomNum, setRandomNum] = useState(Math.floor(Math.random() * 10));
  const [forms, setForms] = useState(draftCardsData ?? [createEmptyForm(1)]);
  const { success, errors } = useActionData() || {};
  const submit = useSubmit();
  const navigation = useNavigation();

  function handleFormChange(changedForm) {
    setForms((prevForms) => {
      return prevForms.map((prevForm) => {
        return prevForm.index == changedForm.index ? changedForm : prevForm;
      });
    });
  }

  function handleAddButton() {
    setForms((prevFormIndexes) => {
      const { index } = prevFormIndexes.at(-1);
      return [...prevFormIndexes, createEmptyForm(index + 1)];
    });
  }

  function handleSubmitButton() {
    const cardForms = formContainerRef.current.querySelectorAll("form");
    const cardsData = Array.from(cardForms, (form) => ({
      data: Object.fromEntries(new FormData(form)),
      name: form.name,
    }));
    submit(
      { data: cardsData, intent: "add" },
      { method: "post", encType: "application/json" },
    );
  }

  function handleCardsButtons(e) {
    if (e.target.tagName == "BUTTON") {
      const deletedFormIndex =
        e.target.parentElement.parentElement.dataset.formindex;
      setForms((prevFormIndexes) =>
        prevFormIndexes.filter(({ index }) => index != deletedFormIndex),
      );
    }
  }

  useEffect(() => {
    if (success) {
      setForms([createEmptyForm(1)]);
      setRandomNum(Math.floor(Math.random() * 10));
    }
  }, [success]);

  // Masonry
  const [, setWindowWidth] = useState(window.innerWidth);
  const root = document.querySelector(":root");
  const style = window.getComputedStyle(root);
  const column = Number.parseInt(style.getPropertyValue("--column"));

  function resizeWindowHandler() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", resizeWindowHandler);
    return () => {
      window.removeEventListener("resize", resizeWindowHandler);
    };
  }, []);

  const formsMasonry = forms.reduce((array, form, index) => {
    index = index < column ? index : index % column;
    array[index] = [...array[index], form];
    return array;
  }, new Array(column).fill([]));

  // Dialog

  const dialogRef = useRef();
  const navigate = useNavigate();

  function handleDialogClose() {
    dialogRef.current.close();
  }

  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      dialogRef.current.close();
      navigate("/mine");
    }
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      dialogRef.current.close();
      navigate("/mine");
    }
  }

  useEffect(() => {
    if (location.pathname !== "/mine") {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [location.pathname]);

  // Auto draft cards form

  const fetcher = useFetcher();

  function handleFormMousLeave() {
    fetcher.submit(
      { data: forms, intent: "draft" },
      { method: "post", encType: "application/json" },
    );
  }

  return success ? (
    <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
      <Loading className="flex-1 flex flex-col justify-center items-center" />
      <Navigate to={"/mine"} />
    </main>
  ) : (
    <main
      ref={formContainerRef}
      onMouseLeave={handleFormMousLeave}
      style={{ scrollbarGutter: "stable" }}
      className="container w-dvw md:w-full flex-1 p-2 flex flex-col items-stretch gap-2 overflow-y-auto scrollbar-thin relative"
    >
      {navigation.state === "submitting" || navigation.state === "loading" ? (
        <Loading className="flex-1 flex flex-col justify-center items-center" />
      ) : (
        <>
          <section className="sticky top-0 flex gap-2 bg-inherit z-50">
            <Card
              as="button"
              onClick={handleAddButton}
              className="flex-1 flex items-center justify-center gap-2 text-nowrap hover:cursor-pointer"
            >
              <SquarePlus size={20} />
              Tambah Kartu
            </Card>
            <Card
              as="button"
              onClick={handleSubmitButton}
              className="flex-1 flex items-center justify-center gap-2 text-nowrap hover:cursor-pointer"
            >
              <SaveAll size={20} />
              Simpan Kartu
            </Card>
          </section>
          <section
            onClick={handleCardsButtons}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
          >
            {formsMasonry.map((column, index) => (
              <div key={index} className="flex flex-col gap-2 relative">
                {column.map((form) => (
                  <CardForm
                    key={`${randomNum}${form.index}`}
                    form={form}
                    cardCount={forms.length}
                    isError={
                      errors ? errors.includes(`card_${form.index}`) : false
                    }
                    handleFormChange={handleFormChange}
                  />
                ))}
              </div>
            ))}
          </section>
        </>
      )}
      <Dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onKeyDown={handleEscDown}
      >
        <Outlet context={[handleDialogClose]} />
      </Dialog>
    </main>
  );
}

Component.displayName = "MineRoute";
