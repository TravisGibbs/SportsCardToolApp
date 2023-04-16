import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router';

export default function Edit() {
  const [form, setForm] = useState({
    auto: '',
    back_img: '',
    front_img: '',
    group: '',
    listing: '',
    mem: '',
    name: '',
    number: '',
    price: '',
    rc: '',
    serial: '',
    set: '',
    team: '',
    year: '',
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(
        `http://localhost:5000/api/v1/sportscards/id/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const json_res = await response.json();
      if (!json_res) {
        window.alert(`Record with id ${id} not found`);
        navigate('/');
        return;
      }

      console.log(json_res);
      const record = json_res['card'];

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm(prev => {
      return {...prev, ...value};
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedPerson = {
      auto: form.auto,
      back_img: form.back_img,
      front_img: form.front_img,
      group: form.group,
      listing: form.listing,
      mem: form.mem,
      name: form.name,
      number: form.number,
      price: form.price,
      rc: form.rc,
      serial: form.serial,
      set: form.set,
      team: form.team,
      year: form.year,
    };

    // This will send a post request to update the data in the database.
    await fetch(
      `http://localhost:5000/api/v1/sportscards/update/${params.id}`,
      {
        method: 'POST',
        body: JSON.stringify(editedPerson),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    navigate('/');
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={e => updateForm({name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label htmlFor="team">team: </label>
          <input
            type="text"
            className="form-control"
            id="team"
            value={form.team}
            onChange={e => updateForm({position: e.target.value})}
          />
        </div>
        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
