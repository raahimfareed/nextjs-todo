import moment, { Moment as MomentType } from 'moment';
import Head from 'next/head'
import { SyntheticEvent, useEffect, useState } from 'react';
import { MdDelete, MdAdd } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: number;
  description: string;
  date: MomentType;
}

export default function Index() {
  const [item, setItem] = useState("");
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [currentId, setCurrentId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const items = localStorage.getItem("todo-items");
    const currentId = localStorage.getItem("todo-current-id");

    if (items === null || items.length === 0) {
      setLoading(false);
      return;
    }
    setCurrentId(currentId !== null ? parseInt(currentId) : 0);
    setAllItems(JSON.parse(items));
    setLoading(false);
  }, []);

  const add = (e: SyntheticEvent) => {
    e.preventDefault();
    if (loading) return;
    const items = [...allItems];
    items.push({
      id: currentId + 1,
      description: item,
      date: moment()
    });

    localStorage.setItem('todo-items', JSON.stringify(items));
    localStorage.setItem('todo-current-id', `${currentId + 1}`);

    setCurrentId(currentId + 1);
    setAllItems(items);
    setItem("");
  }

  const remove = (e: SyntheticEvent, id: number) => {
    e.preventDefault();
    if (loading) return;
    const items = [...allItems];

    let index = items.findIndex(item => item.id === id);
    items.splice(index, 1);
    setAllItems(items);

    localStorage.setItem('todo-items', JSON.stringify(items));
    setItem("");
  }

  return (
    <>
      <Head>
        <title>Never forget another thing!</title>
      </Head>
      <div>
        <div className="container mx-auto max-w-[1024px]">
          <h1 className="text-3xl font-bold mt-12">To-Do List</h1>
          <form className='w-full md:w-1/3'>
            <h3 className="text-xl mt-6">Add Item</h3>
            <textarea
              className="w-full rounded py-1 px-2 outline-none border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400 transition-colors" placeholder='Buy eggs...'
              onChange={(e) => setItem(e.target.value)}
              value={item}
              />
            <button
              className="mt-1 rounded-md bg-blue-300 bg-opacity-20 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-opacity-75 transition flex items-center justify-center"
              onClick={add}
              disabled={loading}
              >
                <MdAdd className="mr-2" /> Add
            </button>
          </form>
          <h3 className="text-xl mt-6">All Items</h3>
          <table className='w-full'>
            <thead className="font-bold">
              <tr>
                <td>#</td>
                <td>To-Do</td>
                <td>Date</td>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {allItems.map(item => <tr key={uuidv4()}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{moment().format("DD MMM, YYYY")}</td>
                <td>
                  <button className="rounded-md bg-red-300 bg-opacity-20 px-4 py-2 text-sm font-medium text-red-800 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-opacity-75 transition" onClick={(e) => remove(e, item.id)}><MdDelete /></button>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
