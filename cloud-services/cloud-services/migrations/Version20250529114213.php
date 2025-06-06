<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250529114213 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Modificări fără operații pe indexuri sau modificări id';
    }

    public function up(Schema $schema): void
    {
        // Modificăm coloanele LONGTEXT fără să atingem id sau indexuri
        $this->addSql(<<<'SQL'
            ALTER TABLE consultatii 
            CHANGE motivul_prezentarii motivul_prezentarii LONGTEXT DEFAULT NULL, 
            CHANGE simptome simptome LONGTEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE diagnostice 
            CHANGE descriere descriere LONGTEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE medicamente 
            CHANGE descriere descriere LONGTEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE pacienti 
            CHANGE adresa adresa VARCHAR(255) DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE recomandari 
            CHANGE indicatii indicatii LONGTEXT DEFAULT NULL
        SQL);

        

        $this->addSql(<<<'SQL'
            ALTER TABLE trimiteri 
            CHANGE detalii detalii LONGTEXT DEFAULT NULL, 
            CHANGE motiv motiv LONGTEXT DEFAULT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // Revertim modificările făcute în up()

        $this->addSql(<<<'SQL'
            ALTER TABLE consultatii 
            CHANGE motivul_prezentarii motivul_prezentarii TEXT DEFAULT NULL, 
            CHANGE simptome simptome TEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE diagnostice 
            CHANGE descriere descriere TEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE medicamente 
            CHANGE descriere descriere TEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE pacienti 
            CHANGE adresa adresa TEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE recomandari 
            CHANGE indicatii indicatii TEXT DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE retete_medicale 
            ADD data_eliberarii DATETIME DEFAULT NULL
        SQL);

        $this->addSql(<<<'SQL'
            ALTER TABLE trimiteri 
            CHANGE detalii detalii TEXT DEFAULT NULL, 
            CHANGE motiv motiv TEXT DEFAULT NULL
        SQL);
    }
}
