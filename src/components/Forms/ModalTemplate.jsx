import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import BuilderForm from '../Builder/BuilderForm.jsx';
import { GlobalContext } from '../context/Global.jsx';
import {
  checkRequiredForm,
  createMarkup,
  deleteByIndex,
  getLabelName,
  updateFormState,
} from '../../utils/GeneratorUtils';
import { getSchema } from '../../services/DmpServiceApi';
import styles from '../assets/css/form.module.css';
import CustomButton from '../Styled/CustomButton.jsx';

/**
 * It takes a template name as an argument, loads the template file, and then
 * renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({
  propName,
  value,
  templateId,
  level,
  tooltip,
  header,
  fragmentId,
}) {
  const [show, setShow] = useState(false);
  const { formData, setFormData, subData, setSubData, locale } = useContext(GlobalContext);
  const [index, setindex] = useState(null);

  const [template, setTemplate] = useState(null);
  useEffect(() => {
    getSchema(templateId).then((res) => {
      setTemplate(res.data);
    });
  }, [templateId]);
  /**
   * The function sets the show state to false
   */
  const handleClose = () => {
    setShow(false);
    setSubData(null);
    setindex(null);
  };

  /**
   * If the subData variable is not empty, check if the form is valid, if it is,
   * add the subData variable to the form, if it's not, show an error message.
   */
  const handleAddToList = () => {
    if (!subData) return handleClose();

    const checkForm = checkRequiredForm(template, subData);
    if (checkForm)
      return toast.error(
        `Veuiller remplir le champs ${getLabelName(checkForm, template)}`
      );

    if (index !== null) {
      const filterDeleted = formData?.[fragmentId]?.[propName].filter((el) => el.updateType !== 'delete');
      const deleteIndex = deleteByIndex(filterDeleted, index);
      const concatedObject = [...deleteIndex, { ...subData, updateType: 'update' }];
      setFormData(updateFormState(formData, fragmentId, propName, concatedObject));
      setSubData(null);
    } else {
      handleSave();
      toast.success('Enregistrement a été effectué avec succès !');
    }
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data,
   * the subData is set to null, and the modal is closed.
   */
  const handleSave = () => {
    let newObject = formData[propName] || [];
    newObject = [...newObject, subData];
    setFormData({ ...formData, [propName]: newObject });
    setSubData(null);
    handleClose();
  };

  /**
   * The function takes a boolean value as an argument and sets the state
   * of the show variable to the value of the argument.
   * @param isOpen - boolean
   */
  const handleShow = (isOpen) => {
    setShow(isOpen);
  };

  /**
   * It creates a new array, then removes the item at the index specified
   * by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDeleteList = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: 'Ëtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cet élément ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer !',
    }).then((result) => {
      if (result.isConfirmed) {
        const filterDeleted = formData?.[fragmentId]?.[propName].filter((el) => el.updateType !== 'delete');
        filterDeleted[idx]['updateType'] = 'delete';
        setFormData(updateFormState(formData, fragmentId, propName, filterDeleted));
        Swal.fire('Supprimé!', 'Opération effectuée avec succès!.', 'success');
      }
    });
  };

  /**
   * This function handles the edit functionality for a form element in a React component.
   */
  const handleEdit = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const filterDeleted = formData?.[fragmentId]?.[propName].filter((el) => el.updateType !== 'delete');
    setSubData(filterDeleted[idx]);
    setShow(true);
    setindex(idx);
  };

  return (
    <>
      <fieldset className="sub-fragment border p-2 mb-2">
        <legend className="sub-fragment" data-toggle="tooltip" data-original-title={tooltip}>
          {value[`form_label@${locale}`]}
        </legend>
        {formData?.[fragmentId]?.[propName] && registerFile && (
          <table style={{ marginTop: '20px' }} className="table table-bordered">
            <thead>
              {formData?.[fragmentId]?.[propName].length > 0 &&
                registerFile &&
                header &&
                formData?.[fragmentId]?.[propName].some((el) => el.updateType !== 'delete') && (
                  <tr>
                    <th scope="col">{header}</th>
                    <th scope="col"></th>
                  </tr>
                )}
            </thead>
            <tbody>
              {formData?.[fragmentId]?.[propName]
                .filter((el) => el.updateType !== 'delete')
                .map((el, idx) => (
                  <tr key={idx}>
                    <td scope="row">
                      <div className={styles.border} dangerouslySetInnerHTML={createMarkup(parsePatern(el, registerFile.to_string))}></div>
                    </td>
                    <td style={{ width: "10%" }}>
                      <div className="col-md-1">
                        {level === 1 && (
                          <span>
                            <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleEdit(e, idx)}>
                              <i className="fa fa-edit" />
                            </a>
                          </span>
                        )}
                      </div>
                      <div className="col-md-1">
                        <span>
                          <a className="text-primary" href="#" aria-hidden="true" onClick={(e) => handleDeleteListe(e, idx)}>
                            <i className="fa fa-times" />
                          </a>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <CustomButton
          handleNextStep={() => {
            handleShow(true);
          }}
          title="Ajouter un élément"
          type="primary"
          position="start"
        ></CustomButton>
      </fieldset>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {propName === 'funding' && index !== null && subData && (
            <div className={`col-md-12 ${styles.funder}`}>
              <fieldset className="sub-fragment registry">
                <legend className={`sub-fragment registry ${styles.legend}`}>
                  Financeurs
                  <a href="#">
                    <span className="registry-info fas fa-info-circle" />
                  </a>
                </legend>
                <div className="col-md-12 fragment-display">
                  <div className="fragment-property">
                    <span className="property-label">Nom du financeur : </span>
                    <span className="property-value">{subData?.funder?.name}</span>
                  </div>
                  <div className="fragment-property">
                    <span className="property-label">Identifiant : </span>
                    <span className="property-value">{subData?.funder?.funderId}</span>
                  </div>
                  <div className="fragment-property">
                    <span className="property-label">Type d'identifiant : </span>
                    <span className="property-value">{subData?.funder?.idType}</span>
                  </div>
                  <fieldset className="fragment-display sub-fragment">
                    <legend className={styles.legend}>Politique de données</legend>
                    <div className="fragment-property">
                      <span className="property-label">Titre : </span>
                      <span className="property-value">{subData?.funder?.dataPolicy?.title}</span>
                    </div>
                    <div className="fragment-property">
                      <span className="property-label">Identifiant : </span>
                      <span className="property-value">{subData?.funder?.dataPolicy?.docIdentifier}</span>
                    </div>
                    <div className="fragment-property">
                      <span className="property-label">Type d'identifiant : </span>
                      <span className="property-value">{subData?.funder?.dataPolicy?.idType}</span>
                    </div>
                  </fieldset>
                </div>
              </fieldset>
            </div>
          )}
          <BuilderForm shemaObject={registerFile} level={level + 1}></BuilderForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleAddToList}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTemplate;
