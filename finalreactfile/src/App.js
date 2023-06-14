import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';

const RecipeTable = () => {
  const [data, setData] = useState([]);
  const [editedPrices, setEditedPrices] = useState({});

  useEffect(() => {
    // Fetch data from the API
    fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setEditedPrices({});
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handlePriceChange = (e, rowIndex) => {
    const { value } = e.target;
    setEditedPrices((prevPrices) => ({
      ...prevPrices,
      [rowIndex]: value,
    }));
  };

  const handleSave = () => {
    // Update the prices in the data based on editedPrices
    const updatedData = data.map((row, index) => ({
      ...row,
      price: editedPrices[index] !== undefined ? editedPrices[index] : row.price,
    }));
    setData(updatedData);
    setEditedPrices({});
  };

  const handleReset = () => {
    setEditedPrices({});
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: 'Category',
        accessor: 'category',
        sortType: 'basic',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ row, value }) => (
          <input
            type="text"
            value={editedPrices[row.index] !== undefined ? editedPrices[row.index] : value}
            onChange={(e) => handlePriceChange(e, row.index)}
          />
        ),
      },
    ],
    [editedPrices]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="header-cell"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="data-row">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="data-cell">
                    {cell.render('Cell')}
                  </td>                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="button-container">
        <button onClick={handleSave} className="save-button">Save</button>
        <button onClick={handleReset} className="reset-button">Reset</button>
      </div>
    </div>
  );
};

export default RecipeTable;

