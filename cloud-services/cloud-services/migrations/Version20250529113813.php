<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250529113813 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Actualizare coloane text și indici, fără modificarea coloanei id din consultatii și alte tabele';
    }

    public function up(Schema $schema): void
    {
        // Modificăm coloanele LONGTEXT la consultatii, fără să schimbăm id
        $this->addSql(<<<'SQL'
            ALTER TABLE consultatii 
            CHANGE motivul_prezentarii motivul_prezentarii LONGTEXT DEFAULT NULL, 
            CHANGE simptome simptome LONGTEXT DEFAULT NULL
        SQL);

        // Modificăm diagnostice fără schimbarea id
        $this->addSql(<<<'SQL'
            ALTER TABLE diagnostice 
            CHANGE descriere descriere LONGTEXT DEFAULT NULL
        SQL);
        $this->addSql('ALTER TABLE diagnostice RENAME INDEX cod_icd TO UNIQ_7B443D566245977A');

        // Modificări pe doctori
        $this->addSql('DROP INDEX cod_parafa ON doctori');
        // Ai grijă ca schimbarea id să nu elimine AUTO_INCREMENT, dacă există
        $this->addSql('ALTER TABLE doctori CHANGE id id INT NOT NULL');

        // Modificări pe medicamente
        $this->addSql(<<<'SQL'
            ALTER TABLE medicamente 
            CHANGE descriere descriere LONGTEXT DEFAULT NULL
        SQL);

        // Modificări pe pacienti
        $this->addSql(<<<'SQL'
            ALTER TABLE pacienti 
            CHANGE adresa adresa VARCHAR(255) DEFAULT NULL
        SQL);

        // Modificări pe recomandari
        $this->addSql(<<<'SQL'
            ALTER TABLE recomandari 
            CHANGE indicatii indicatii LONGTEXT DEFAULT NULL
        SQL);
        $this->addSql('ALTER TABLE recomandari RENAME INDEX fk_recomandare TO IDX_4DDFA1A190A2F215');

        // Modificări pe retete_medicale
        $this->addSql(<<<'SQL'
            ALTER TABLE retete_medicale 
            DROP data_eliberarii
        SQL);
        $this->addSql('ALTER TABLE retete_medicale RENAME INDEX cod_reteta TO UNIQ_6E2422A8172329A4');
        $this->addSql('ALTER TABLE retete_medicale RENAME INDEX fk_reteta TO IDX_6E2422A890A2F215');

        // Pentru trimiteri:
        $this->addSql('ALTER TABLE trimiteri DROP FOREIGN KEY fk_trimitere');

        $this->addSql(<<<'SQL'
            ALTER TABLE trimiteri 
            CHANGE detalii detalii LONGTEXT DEFAULT NULL, 
            CHANGE motiv motiv LONGTEXT DEFAULT NULL
        SQL);

        $this->addSql('ALTER TABLE trimiteri ADD CONSTRAINT fk_trimitere FOREIGN KEY (consultatie_id) REFERENCES consultatii(id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // Revertim modificările făcute în up(), ajustați după cum aveți nevoie

        $this->addSql('ALTER TABLE trimiteri DROP FOREIGN KEY fk_trimitere');

        $this->addSql(<<<'SQL'
            ALTER TABLE trimiteri 
            CHANGE detalii detalii TEXT DEFAULT NULL, 
            CHANGE motiv motiv TEXT DEFAULT NULL
        SQL);
        $this->addSql('ALTER TABLE trimiteri ADD CONSTRAINT fk_trimitere FOREIGN KEY (consultatie_id) REFERENCES consultatii(id)');

        $this->addSql('ALTER TABLE retete_medicale ADD data_eliberarii DATETIME DEFAULT NULL');

        $this->addSql('ALTER TABLE retete_medicale RENAME INDEX uniq_6e2422a8172329a4 TO cod_reteta');
        $this->addSql('ALTER TABLE retete_medicale RENAME INDEX idx_6e2422a890a2f215 TO fk_reteta');

        $this->addSql(<<<'SQL'
            ALTER TABLE recomandari 
            CHANGE indicatii indicatii TEXT DEFAULT NULL
        SQL);
        $this->addSql('ALTER TABLE recomandari RENAME INDEX idx_4ddfa1a190a2f215 TO fk_recomandare');

        $this->addSql('ALTER TABLE pacienti CHANGE adresa adresa TEXT DEFAULT NULL');

        // Recreăm indexul cod_parafa pe doctori
        $this->addSql('CREATE UNIQUE INDEX cod_parafa ON doctori (cod_parafa)');

        $this->addSql(<<<'SQL'
            ALTER TABLE diagnostice 
            CHANGE descriere descriere TEXT DEFAULT NULL
        SQL);
        $this->addSql('ALTER TABLE diagnostice RENAME INDEX uniq_7b443d566245977a TO cod_icd');

        // Dacă vrei, poți elimina redenumirile indexurilor consultatii din down, 
        // dacă nu le-ai redenumit în up
        /*
        $this->addSql('ALTER TABLE consultatii RENAME INDEX idx_a924fd37946c9c5f TO fk_consultatii_pacient');
        $this->addSql('ALTER TABLE consultatii RENAME INDEX idx_a924fd37224cca91 TO fk_diagnostic');
        $this->addSql('ALTER TABLE consultatii RENAME INDEX idx_a924fd37f62b82d1 TO fk_doctor_cnp');
        $this->addSql('ALTER TABLE consultatii RENAME INDEX idx_a924fd37ab0d61f7 TO fk_medicament');
        */

        $this->addSql(<<<'SQL'
            ALTER TABLE consultatii 
            CHANGE motivul_prezentarii motivul_prezentarii TEXT DEFAULT NULL, 
            CHANGE simptome simptome TEXT DEFAULT NULL
        SQL);
    }
}
