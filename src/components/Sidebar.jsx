import { useRef, useState } from 'react';

const Sidebar = ({ search, setSearch, handleSearch, list, select, add, remove, importList, exportList }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const importFileRef = useRef();

  const selectItem = (item) => {
    setSelectedItem(item);
    select(item);
  }

  return (
    <div className='flex flex-col w-96 mr-4'>
      <div className='flex w-full mb-2'>
        <input
          placeholder="Search..."
          className="p-2 border-[1px] focus:border-black outline-none"
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
        />

        <button className='p-2 ml-2 bg-gray-700 hover:bg-gray-500 text-white text-sm' onClick={handleSearch}>SEARCH</button>
      </div>

      <div className='flex flex-col w-full h-full border-[1px] border-gray-300 overflow-auto'>
        {
          list.length > 0 ? list.map((item, index) => (
            <div
              key={index}
              className={`p-3 text-sm hover:bg-slate-200 cursor-pointer ${selectedItem && selectedItem.id === item.id ? 'bg-gray-300' : 'bg-white'}`}
              onClick={() => selectItem(item)}
            >
              {item.address}
            </div>
          )) : (
            <div className='p-3 text-gray-400'>No Saved Locations</div>
          )
        }
      </div>

      <div className='flex w-full mt-2'>
        <button
          className='w-full p-3 bg-blue-500 text-white mr-1 hover:bg-blue-600'
          onClick={add}
        >
          ADD
        </button>

        <button
          className='w-full p-3 bg-red-500 text-white ml-1 hover:bg-red-600 disabled:bg-gray-300'
          onClick={() => remove(selectedItem?.id)}
          disabled={!selectedItem}
        >
          REMOVE
        </button>
      </div>

      <div className='flex w-full mt-2'>
        <button
          className='w-full p-3 bg-yellow-500 text-white mr-1 hover:bg-yellow-600'
          onClick={() => importFileRef.current.click()}
        >
          IMPORT
        </button>

        <input ref={importFileRef} type='file' className='hidden' accept='.json' onChange={importList} />

        <button
          className='w-full p-3 bg-green-500 text-white ml-1 hover:bg-green-600 disabled:bg-gray-300'
          onClick={exportList}
          disabled={list.length === 0}
        >
          EXPORT
        </button>
      </div>
    </div>
  );
}

export default Sidebar;