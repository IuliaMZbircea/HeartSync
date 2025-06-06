<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250530110944 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Am șters comenzile care modifică foreign keys

        //$this->addSql('ALTER TABLE doctori CHANGE id id INT UNSIGNED NOT NULL');
       // $this->addSql('ALTER TABLE doctori RENAME INDEX id TO UNIQ_4B147EC4BF396750');

      //  $this->addSql('ALTER TABLE pacienti CHANGE id id INT NOT NULL');
       // $this->addSql('ALTER TABLE pacienti RENAME INDEX id TO UNIQ_CF7DE575BF396750');
        //$this->addSql('DROP INDEX cod_trimitere ON trimiteri');

       // $this->addSql('ALTER TABLE trimiteri RENAME INDEX FK_1873EC9C90A2F215 TO IDX_1873EC9C90A2F215');
    }

    public function down(Schema $schema): void
    {
        // Și aici am șters comenzile care modifică foreign keys

        //$this->addSql('ALTER TABLE doctori CHANGE id id INT AUTO_INCREMENT NOT NULL');
       // $this->addSql('ALTER TABLE doctori RENAME INDEX uniq_4b147ec4bf396750 TO id');

        $this->addSql('CREATE UNIQUE INDEX cod_trimitere ON trimiteri (cod_trimitere)');
       // $this->addSql('ALTER TABLE trimiteri RENAME INDEX idx_1873ec9c90a2f215 TO fk_trimitere');

        //$this->addSql('ALTER TABLE pacienti CHANGE id id INT AUTO_INCREMENT NOT NULL');
        //$this->addSql('ALTER TABLE pacienti RENAME INDEX uniq_cf7de575bf396750 TO id');
    }
}
