import { useEffect, useState, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PreferencesContext } from "../../context/PreferencesContext/PreferencesContext";

export function PrefControlColor({ name, action, v, ...props }) {
  const { dispatch, state, configID } = useContext(PreferencesContext);
  const [properties, setProperties] = useState([
    { re: "", style: "color:#000000;" },
  ]);

  useEffect(() => {
    setProperties(state[configID][name]);
  }, []);

  useEffect(() => {
    action(properties);
  }, [properties]);

  return (
    <div className="d-flex p-2">
      <div style={{ width: "9rem", alignSelf: "center", textAlign: "center" }}>
        {name}
      </div>

      <div
        style={{
          borderLeft: "solid 1px",
          borderColor: "var(--bs-border-color)",
        }}
        className="ps-2"
      >
        {properties.map((p, i) => {
          return (
            <div key={i} className="d-flex" style={{ width: "50rem" }}>
              <InputGroup className="">
                <textarea
                  spellCheck={false}
                  placeholder="CSS rules"
                  className="form-control"
                  value={properties[i].style}
                  onChange={(e) =>
                    setProperties(
                      properties.map((c, ii) => {
                        if (i === ii) {
                          return { ...properties[ii], style: e.target.value };
                        } else {
                          return c;
                        }
                      })
                    )
                  }
                />
                <InputGroup.Text>^(?!.*span)</InputGroup.Text>
                <Form.Control
                  spellCheck={false}
                  value={properties[i].re}
                  placeholder="Regex"
                  onChange={(e) =>
                    setProperties(
                      properties.map((c, ii) => {
                        if (i === ii) {
                          return { ...properties[ii], re: e.target.value };
                        } else {
                          return c;
                        }
                      })
                    )
                  }
                />
                <InputGroup.Text>gm</InputGroup.Text>
              </InputGroup>

              <Button
                className="p-1"
                variant="outline-secondary"
                onClick={() =>
                  setProperties(properties.filter((e, ii) => ii !== i))
                }
                style={{ color: "var(--bs-danger)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </Button>
            </div>
          );
        })}

        <div className="d-flex" style={{ width: "50rem" }}>
          <Button
            className="p-1"
            variant="outline-secondary"
            style={{ color: "var(--bs-success)" }}
            onClick={() =>
              setProperties([...properties, { re: "", color: "#000000" }])
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
