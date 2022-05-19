import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { heroCreated } from '../../actions';

const HeroesAddForm = () => {
    const { filters, filtersLoadingStatus } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');


    const onValueChangeName = (e) => {
        setName(e.target.value)
    }
    const onValueChangeText = (e) => {
        setDescription(e.target.value)
    }
    const onValueChangeElement = (e) => {
        setElement(e.target.value)
    }

    const handleAdd = (e) => {
        e.preventDefault();
        const newHero = {
            name: name,
            description: description,
            element: element,
            id: uuidv4(),
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'Отправка успешна'))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err));

        setName('');
        setDescription('');
        setElement('');
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({ name, label }) => {
                // eslint-disable-next-line
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={handleAdd}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                    onChange={onValueChangeName} />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text"
                    value={description}
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }}
                    onChange={onValueChangeText} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={element}
                    onChange={onValueChangeElement}>
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;