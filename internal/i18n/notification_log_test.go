package i18n

import (
	"bytes"
	"errors"
	"strings"
	"testing"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"github.com/sirupsen/logrus"
	"github.com/zitadel/logging"
	"golang.org/x/text/language"
)

func TestTranslationWarningDoesNotExposeTemplateData(t *testing.T) {
	var captured bytes.Buffer
	if err := (&logging.Config{Level: "warn"}).SetLogger(); err != nil {
		t.Fatal(err)
	}
	logger := logrus.StandardLogger()
	previous := logger.Out
	logger.SetOutput(&captured)
	t.Cleanup(func() { logger.SetOutput(previous) })

	bundle := i18n.NewBundle(language.English)
	if err := bundle.AddMessages(language.English, &i18n.Message{ID: "broken", Other: "{{ call .Fail }}"}); err != nil {
		t.Fatal(err)
	}
	localizer := i18n.NewLocalizer(bundle, "en")
	proof := "synthetic-proof-4113"
	contact := "synthetic-contact-4113@example.invalid"
	for name, id := range map[string]string{"missing": "missing-" + proof + "-" + contact, "execution": "broken"} {
		t.Run(name, func(t *testing.T) {
			captured.Reset()
			args := map[string]interface{}{"Code": proof, "Email": contact, "Fail": func() (string, error) {
				return "", errors.New(proof + " " + contact)
			}}
			if got := localize(localizer, id, args); got != id {
				t.Fatal("unexpected translation fallback")
			}
			logs := captured.String()
			if !strings.Contains(logs, "missing translation") || strings.Contains(logs, proof) || strings.Contains(logs, contact) {
				t.Fatal("translation warning missing or contained synthetic data")
			}
		})
	}
}
