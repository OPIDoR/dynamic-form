import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import swal from "sweetalert";
import toast from "react-hot-toast";
import BuilderForm from "../Builder/BuilderForm.jsx";
import { GlobalContext } from "../context/Global.jsx";
import {
  checkRequiredForm,
  createMarkup,
  deleteByIndex,
  getLabelName,
  parsePattern,
} from "../../utils/GeneratorUtils";
import { getSchema } from "../../services/DmpServiceApi";

/**
 * It takes a template name as an argument, loads the template file, and then
 * renders a modal with the template file as a prop.
 * </code>
 * @returns A React component.
 */
function ModalTemplate({
  value,
  templateId,
  keyValue,
  level,
  tooltip,
  header,
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
      const deleteIndex = deleteByIndex(formData[keyValue], index);
      setFormData({ ...formData, [keyValue]: [...deleteIndex, subData] });
      setSubData(null);
    } else {
      handleSave();
      toast.success("Enregistrement a été effectué avec succès !");
    }
    handleClose();
  };

  /**
   * When the user clicks the save button, the form is updated with the new data,
   * the subData is set to null, and the modal is closed.
   */
  const handleSave = () => {
    let newObject = formData[keyValue] || [];
    newObject = [...newObject, subData];
    setFormData({ ...formData, [keyValue]: newObject });
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
   * When the user clicks the edit button, the form is populated with
   * the data from the row that was clicked.
   * @param idx - the index of the item in the array
   */
  const handleEdit = (idx) => {
    console.log(formData[keyValue][idx]);
    setSubData(formData[keyValue][idx]);
    setShow(true);
    setindex(idx);
  };

  /**
   * It creates a new array, then removes the item at the index specified
   * by the parameter, then sets the state to the new array.
   * @param idx - the index of the item in the array
   */
  const handleDeleteListe = (idx) => {
    swal({
      title: "Ëtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer cet élément ?",
      icon: "info",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const deleteIndex = deleteByIndex(formData[keyValue], idx);
        setFormData({ ...formData, [keyValue]: deleteIndex });
        // toast.success("Congé accepté");
        swal("Opération effectuée avec succès!", {
          icon: "success",
        });
      }
    });
  };

  return (
    <>
      <fieldset className="sub-fragment border p-2 mb-2">
        <legend className="sub-fragment" data-toggle="tooltip" data-original-title={tooltip}>
          {value[`form_label@${locale}`]}
        </legend>
        {formData[keyValue] && template && (
          <table style={{ marginTop: "20px" }} className="table table-bordered linked-fragments-list">
            <thead>
              {formData[keyValue].length > 0 && template && header && (
                <tr>
                  <th scope="col">{header}</th>
                  <th scope="col">Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {formData[keyValue].map((el, idx) => (
                <tr key={idx}>
                  <td scope="row">
                    <div
                      className="preview"
                      dangerouslySetInnerHTML={createMarkup(
                        parsePattern(el, template.to_string)
                      )}
                    ></div>
                  </td>

                  <td style={{ width: "10%" }}>
                    <div className="col-md-1">
                      {level === 1 && (
                        <span>
                          <a
                            className="text-primary"
                            href="#"
                            aria-hidden="true"
                            onClick={() => handleEdit(idx)}
                          >
                            <i className="fa fa-edit" />
                          </a>
                        </span>
                      )}
                    </div>
                    <div className="col-md-1">
                      <span>
                        <a
                          className="text-danger"
                          href="#"
                          aria-hidden="true"
                          onClick={() => handleDeleteListe(idx)}
                        >
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

        <button
          className="btn btn-primary button-margin"
          onClick={() => handleShow(true)}
        >
          Créé
        </button>
      </fieldset>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {keyValue === "funding" && index !== null && subData && (
            <div className="col-md-12 funder">
              <fieldset className="sub-fragment registry">
                <legend className="sub-fragment registry legend">
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
                    <span className="property-value">
                      {subData?.funder?.funderId}
                    </span>
                  </div>
                  <div className="fragment-property">
                    <span className="property-label">
                      Type d'identifiant :{" "}
                    </span>
                    <span className="property-value">
                      {subData?.funder?.idType}
                    </span>
                  </div>
                  <fieldset className="fragment-display sub-fragment">
                    <legend className="legend">Politique de données</legend>
                    <div className="fragment-property">
                      <span className="property-label">Titre : </span>
                      <span className="property-value">
                        {subData?.funder?.dataPolicy?.title}
                      </span>
                    </div>
                    <div className="fragment-property">
                      <span className="property-label">Identifiant : </span>
                      <span className="property-value">
                        {subData?.funder?.dataPolicy?.docIdentifier}
                      </span>
                    </div>
                    <div className="fragment-property">
                      <span className="property-label">
                        Type d'identifiant :{" "}
                      </span>
                      <span className="property-value">
                        {subData?.funder?.dataPolicy?.idType}
                      </span>
                    </div>
                  </fieldset>
                </div>
              </fieldset>
            </div>
          )}

          <BuilderForm shemaObject={template} level={level + 1}></BuilderForm>
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